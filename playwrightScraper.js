const { chromium } = require('playwright');
const fs = require('fs');
const careerPages = require('./masterCareerPages');  // Import the careerPages array

// Function to scrape the email from a career page
async function scrapeEmail(page, url) {
  try {
    await page.goto(url, { waitUntil: 'load' });  // Wait until page loads

    // Wait for the body element to be available
    await page.waitForSelector('body');  

    // Get all href attributes that contain 'mailto:' using regex
    const mailtoLinks = await page.$$eval('a[href]', links => 
      links
        .map(link => link.getAttribute('href'))
        .filter(href => /^mailto:/.test(href))  // Filter using regex for 'mailto:'
    );

    return mailtoLinks.length > 0 ? mailtoLinks : null;  // Return the array of mailto links or null if not found

  } catch (error) {
    console.error(`Error occurred on page: ${url} - ${error.message}`);
    return null;  // Return null if there's an error navigating or scraping
  }
}

// Main function to run the scraper
async function runScraper() {
  const browser = await chromium.launch({ headless: false });  // Launch browser in headful mode
  const page = await browser.newPage();     // Open a new page

  let totalCompanies = careerPages.length;  // Total number of companies
  let companiesWithEmails = 0;              // Counter for companies with emails

  // Iterate over the career pages array and add email if found
  for (let i = 0; i < careerPages.length; i++) {
    const pageData = careerPages[i];
    
    // Check if the career page has a valid URL and is not undefined
    if (pageData && pageData.url) {
      const emails = await scrapeEmail(page, pageData.url);

      if (emails) {
        pageData.emails = emails;  // Add emails to the page data
        companiesWithEmails++;      // Increment the counter
      } else {
        console.log(`No email found on: ${pageData.url}`);
      }
    } else {
      console.error(`Invalid data for URL at index ${i}`);
    }
  }

  await browser.close();  // Close the browser

  // Log the updated array with emails
  console.log(careerPages);
  
  // Optionally, save the result to a JSON file
  fs.writeFileSync('updatedCareerPages2.json', JSON.stringify(careerPages, null, 2));

  // Calculate and log the percentage of companies with emails
  const percentageWithEmails = (companiesWithEmails / totalCompanies) * 100;
  console.log(`Percentage of companies with mailto links: ${percentageWithEmails.toFixed(2)}%`);
}

runScraper().catch(err => {
  console.error("Error occurred during scraping:", err);
});
