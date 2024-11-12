const nodemailer = require('nodemailer');
const companies = require('./updatedCareerPages2.json');
require('dotenv').config();

const keywords = [
  'apply', 'applications', 'career', 'careers', 'job', 'jobs', 'recruit', 'recruits', 'recruiting', 'talent', 
  'talentacquisition', 'staffing', 'work', 'join', 'placement', 'placements', 'openings', 
  'employment', 'team', 'people', 'hr', 'hiring'
];

const emailCredentials = [
  { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  { user: process.env.EMAIL_USER_2, pass: process.env.EMAIL_PASSWORD_2 },
  { user: process.env.EMAIL_USER_3, pass: process.env.EMAIL_PASSWORD_3 },
  { user: process.env.EMAIL_USER_4, pass: process.env.EMAIL_PASSWORD_4 },
  { user: process.env.EMAIL_USER_5, pass: process.env.EMAIL_PASSWORD_5 },
  { user: process.env.EMAIL_USER_6, pass: process.env.EMAIL_PASSWORD_6 },
  { user: process.env.EMAIL_USER_7, pass: process.env.EMAIL_PASSWORD_7 },
  { user: process.env.EMAIL_USER_8, pass: process.env.EMAIL_PASSWORD_8 },
  { user: process.env.EMAIL_USER_9, pass: process.env.EMAIL_PASSWORD_9 },
  { user: process.env.EMAIL_USER_10, pass: process.env.EMAIL_PASSWORD_10 },
];

(async () => {
  let currentEmailIndex = 0;

  const sendEmail = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailCredentials[currentEmailIndex].user,
        pass: emailCredentials[currentEmailIndex].pass,
      },
    });

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.responseCode === 550) {
        return false; // Indicate that the email could not be sent due to daily limit
      }
      throw error; // Rethrow other errors
    }
  };

  console.log('Sending emails...');

  for (const company of companies) {
    const { name, url } = company;
    const domain = new URL(url).hostname.split('.').slice(-2).join('.'); // Remove any subdomain if it exists

    for (const keyword of keywords) {
      const newEmail = `${keyword}@${domain}`;
      console.log(newEmail);
      const mailOptions = {
        from: emailCredentials[currentEmailIndex].user,
        to: newEmail,
        subject: `Software Engineer Application for ${name}`,
        html: `Dear Hiring Team,
        <br><br>
I am a Full Stack JavaScript Engineer with a decade of experience in web and mobile development, specializing in cross-platform mobile development in React Native. I led a team in 2019 that engineered the Biodefense Tool for the US Army Medical Research Institute of Infectious Diseases (links: <a href="https://apps.apple.com/us/app/usamriids-biodefense-tool/id1507753114">App Store</a>, <a href="https://play.google.com/store/apps/details?id=com.tradocmobile.bio&hl=en_US">Google Play</a>). I've also developed React Native apps for major clients like JP Morgan Chase and many others.
<br><br>
Additionally, I have extensive experience in all phases of web development as well as automation engineering for testing, monitoring, and alerting. Please feel free to check out my website: <a href="https://www.mattelia.me">www.mattelia.me</a>. I've attached my resume for your consideration.
<br><br>
If this seems like a good fit, I'd love to discuss how I can contribute to your company.
<br><br>
Best,
<br><br>
Matt<br>
+19143183946<br>
<a href="https://www.mattelia.me">www.mattelia.me</a>`,
        attachments: [
          {
            filename: 'resume.pdf',
            path: './resume/resume.pdf', // Update the path to your resume file
          },
        ],
      };

      let emailSent = false;
      while (!emailSent) {
        try {
          emailSent = await sendEmail(mailOptions);
          if (emailSent) {
            console.log(`Email sent to ${newEmail} at ${name}`);
          } else {
            console.log(`Daily limit exceeded for ${emailCredentials[currentEmailIndex].user}. Switching to next email.`);
            currentEmailIndex++;
            if (currentEmailIndex >= emailCredentials.length) {
              console.log('All email accounts have been exhausted.');
              return; // Exit if all email accounts are used
            }
          }
        } catch (error) {
          if (error.code === 'EAUTH') {
            console.log('Too many login attempts. Waiting for 30 seconds before retrying...');
            await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds
          } else {
            throw error; // Rethrow any other errors
          }
        }
      }
    }
  }

  console.log('All emails have been sent successfully.');
})();