export const dynamic = 'force-dynamic';

export async function GET() {
  const res = await fetch(`https://api.github.com/repos/Canhdeeptry/nextjs-whitelist/contents/whitelist.txt`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return Response.json({ content, sha: data.sha });
}

export async function POST(req: Request) {
  const { content, sha, message } = await req.json();

  const cleanedContent = content
    .split('\n')
    .map((line: string) => line.trim())
    .filter(line => line !== '')
    .join('\n');

  const res = await fetch(`https://api.github.com/repos/Canhdeeptry/nextjs-whitelist/contents/whitelist.txt`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: message || 'Update whitelist',
      content: Buffer.from(cleanedContent).toString('base64'),
      sha
    })
  });
  const data = await res.json();
  return Response.json(data);
}