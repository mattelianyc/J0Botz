import json

# Load the JSON data
with open('updatedCareerPages2.json') as f:
    data = json.load(f)

# Initialize an array to hold HR-related email addresses
hr_emails = []

# Define keywords to filter out non-HR emails
non_hr_keywords = ['sales', 'support', 'info', 'contact', 'press']

# Iterate through the companies and their emails
for company in data:
    if 'emails' in company:
        for email in company['emails']:
            # Check if the email contains any non-HR keywords
            if not any(keyword in email for keyword in non_hr_keywords):
                hr_emails.append(email)

# Print the filtered HR-related email addresses
print(hr_emails)