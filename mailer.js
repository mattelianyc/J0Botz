 // Start Generation Here
(async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'matthewalexanderelia@gmail.com',
        pass: process.env.EMAIL_PASSWORD, // Ensure you set your email password in environment variables
      },
    });

    for (const company of companies) {
      const { name, emails } = company;
      if (emails && emails.length > 0) {
        for (const email of emails) {
          const mailOptions = {
            from: 'matthewalexanderelia@gmail.com',
            to: email,
            subject: `Application for ${name} HR Position`,
            text: `Dear ${name} HR Team,

Please find attached my resume for your consideration.

Best regards,
Matthew Alexander Elia`,
            attachments: [
              {
                filename: 'Resume.pdf',
                path: './Resume.pdf', // Update the path to your resume file
              },
            ],
          };

          await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${email} at ${name}`);
        }
      } else {
        console.log(`No HR emails found for ${name}`);
      }
    }

    console.log('All emails have been sent successfully.');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
})();
