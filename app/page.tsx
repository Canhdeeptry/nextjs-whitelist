'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [domains, setDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [sha, setSha] = useState('');

  useEffect(() => {
    fetch('/api/whitelist')
      .then(res => res.json())
      .then(data => {
        setDomains(data.content.split('\n').filter(Boolean));
        setSha(data.sha);
      });
  }, []);

  const updateWhitelist = (newList: string[]) => {
    fetch('/api/whitelist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newList.join('\n'),
        sha: sha,
        message: 'Update whitelist'
      })
    }).then(() => {
      setDomains(newList);
      setNewDomain('');
    });
  };

  const addDomain = () => {
    if (newDomain && !domains.includes(newDomain)) {
      updateWhitelist([...domains, newDomain]);
    }
  };

  const removeDomain = (domain: string) => {
    updateWhitelist(domains.filter(d => d !== domain));
  };

  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Pi-hole Whitelist UI</h1>
      <input
        value={newDomain}
        onChange={e => setNewDomain(e.target.value)}
        placeholder="example.com"
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={addDomain} style={{ padding: '5px 10px' }}>Add</button>
      <ul style={{ marginTop: '20px' }}>
        {domains.map(domain => (
          <li key={domain} style={{ marginBottom: '5px' }}>
            {domain}
            <button onClick={() => removeDomain(domain)} style={{ marginLeft: '10px' }}>❌</button>
          </li>
        ))}
      </ul>
    </main>
  );
}