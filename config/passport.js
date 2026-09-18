const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { sql } = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const username = profile.displayName;

        const check = await sql.query`
            SELECT * FROM users
            WHERE email = ${email}
        `;

        let user;

        if (check.recordset.length > 0) {
            user = check.recordset[0];

        } else {
            const result = await sql.query`
                INSERT INTO users (username, password, email, phone, role, membership_rank)
                OUTPUT INSERTED.id, INSERTED.username,
                       INSERTED.email, INSERTED.phone, INSERTED.role, INSERTED.membership_rank
                VALUES (
                    ${username},
                    NULL,
                    ${email},
                    NULL,
                    'customer',
                    N'HẠNG ĐỒNG'
                )
            `;

            user = result.recordset[0];

            await sql.query`
                INSERT INTO notifications (message, type)
                VALUES (
                    ${`Có Người Dùng USR-00${user.id} Mới ${user.username}`},
                    'user'
                )
            `;
        }

        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

module.exports = passport;