const items = $input.all();

const HR_AUTHOR = /\b(human resources?|talent acquisition|recruiter|recruitment|hiring manager|hr\b|hrbp|ta specialist|staffing|talent partner)\b/i;

const OVER_EXPERIENCE = /\b([4-9]|1[0-9])\s*\+?\s*(years?|yrs?)\b/i;
const SENIOR_TITLE = /\b(senior|lead|principal|head of|director)\b/i;

const HIRING_SIGNAL = /\b(hiring|we're looking for|we are looking for|looking for|open position|join our team|immediate hiring|urgent hiring|recruitment|vacancy)\b/i;
const PROMO_JUNK = /\b(paid (community|bootcamp|mentorship|course)|telegram group|whatsapp group|dm for paid|resume writing service|course advertisement)\b/i;

const ROLE_RELEVANT = /\b(data analyst|data analytics analyst|analytics analyst|bi analyst|business intelligence analyst|power bi (analyst|developer)|reporting analyst|data reporting analyst|mis analyst|mis executive|data (&|and) business analyst|business analyst|product analyst|operations analyst|analytics engineer)\b/i;

const FOREIGN_ONLY = /\b(usa|united states|canada|\buk\b|united kingdom|philippines|manila|quezon city|belgium|brussels|singapore|dubai|uae|germany|australia)\b/i;
const INDIA_SIGNAL = /\b(india|bengaluru|bangalore|hyderabad|chennai|pune|mumbai|delhi|ncr|gurugram|gurgaon|noida|lucknow|ahmedabad|kolkata|chittoor|remote india|₹|inr\b|lpa\b|wfh)\b/i;

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const APPLICATION_LINK = /(https?:\/\/\S+|lnkd\.in\/\S+)/i;

const output = [];

for (const item of items) {
  const d = item.json;
  const content = (d.content || '');
  const headline = (d.authorHeadline || '');

  // Hard rejects: cheap, reliable, high-confidence signals only
  if (!HR_AUTHOR.test(headline)) continue;
  if (!HIRING_SIGNAL.test(content)) continue;
  if (PROMO_JUNK.test(content)) continue;
  if (!ROLE_RELEVANT.test(content)) continue;
  if (OVER_EXPERIENCE.test(content)) continue;
  if (SENIOR_TITLE.test(content)) continue;
  if (FOREIGN_ONLY.test(content) && !INDIA_SIGNAL.test(content)) continue;

  // Soft signals: attach for Gemini to weigh, don't reject here
  const hasCompanyEmail = EMAIL_PATTERN.test(content);
  const hasApplicationLink = APPLICATION_LINK.test(content);
  const hasIndiaSignal = INDIA_SIGNAL.test(content);

  output.push({
    json: {
      ...d,
      hasCompanyEmail,
      hasApplicationLink,
      hasIndiaSignal
    }
  });
}

return output;
