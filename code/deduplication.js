const items = $input.all();

const seen = new Set();
const output = [];

for (const item of items) {
  const data = item.json;

  const url = data.linkedinUrl || '';

  // Skip records without a LinkedIn post URL
  if (!url) continue;

  // Remove duplicate posts returned by different search queries
  if (seen.has(url)) continue;

  seen.add(url);

  output.push({
    json: {
      postUrl: url,
      postId: data.id || '',
      content: data.content || '',
      
      authorName: data.author?.name || '',
      authorHeadline: data.author?.info || '',
      authorUrl: data.author?.linkedinUrl || '',
      
      company: data.company?.name || '',
      
      postedAt: data.postedAt || '',
      
      reactions: data.reactions?.likes || 0,
      comments: data.comments?.count || 0
    }
  });
}

return output;
