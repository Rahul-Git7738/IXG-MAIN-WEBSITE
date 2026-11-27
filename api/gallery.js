/**
 * Vercel Serverless Function: /api/gallery
 * Connects to Microsoft Graph API to automatically sync images & videos from OneDrive/SharePoint
 * 
 * Target Tenant: Influence Exchange Group (65d4e379-8f09-428d-9848-02c028d6e44c)
 * Target Folder: /personal/evaan_fernandes_influenceexchangegroup_com/Documents/All Events
 */

let memoryCache = {
  items: null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes cache
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tenantId = process.env.MICROSOFT_TENANT_ID || '65d4e379-8f09-428d-9848-02c028d6e44c';
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const userEmail = process.env.ONEDRIVE_USER_EMAIL || 'evaan_fernandes@influenceexchangegroup.com';
  const folderPath = process.env.ONEDRIVE_FOLDER_PATH || 'All Events';

  // If Azure credentials are not yet configured in Vercel environment variables:
  if (!clientId || !clientSecret) {
    return res.status(200).json({
      configured: false,
      message: 'Microsoft Graph credentials not yet configured in Vercel. Using fallback local gallery items.',
      items: []
    });
  }

  const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';
  const now = Date.now();
  if (!forceRefresh && memoryCache.items && (now - memoryCache.timestamp < memoryCache.ttl)) {
    return res.status(200).json({
      configured: true,
      cached: true,
      updatedAt: new Date(memoryCache.timestamp).toISOString(),
      count: memoryCache.items.length,
      items: memoryCache.items
    });
  }

  try {
    // 1. Authenticate with Azure AD via Client Credentials Grant
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('grant_type', 'client_credentials');

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('Azure AD Token error:', errText);
      return res.status(500).json({
        configured: true,
        error: 'Failed to authenticate with Microsoft Entra ID',
        details: errText
      });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch files from OneDrive root folder
    const encodedPath = encodeURIComponent(folderPath).replace(/%2F/g, '/');
    const graphUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userEmail)}/drive/root:/${encodedPath}:/children?$expand=thumbnails&$top=999`;

    const graphRes = await fetch(graphUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!graphRes.ok) {
      const errText = await graphRes.text();
      console.error('Microsoft Graph fetch error:', errText);
      return res.status(500).json({
        configured: true,
        error: 'Failed to fetch items from OneDrive folder',
        details: errText
      });
    }

    const folderData = await graphRes.json();
    const rawItems = folderData.value || [];
    const processedItems = [];

    const isImageFile = (name, mime) => (mime && mime.startsWith('image/')) || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(name);
    const isVideoFile = (name, mime) => (mime && mime.startsWith('video/')) || /\.(mp4|mov|webm)$/i.test(name);

    for (const item of rawItems) {
      const name = item.name || '';
      const mime = item.file?.mimeType || '';

      if (isImageFile(name, mime) || isVideoFile(name, mime)) {
        const isVideo = isVideoFile(name, mime);
        const thumbUrl = item.thumbnails?.[0]?.large?.url || item.thumbnails?.[0]?.medium?.url || item['@microsoft.graph.downloadUrl'];
        const isAward = /award|trophy|honour|honor|recognition|gala|winner/i.test(name);
        const isDubai = /dubai|uae|gcc|middle east/i.test(name);
        const isIndia = /india|bangalore|bengaluru|delhi|mumbai/i.test(name);

        let category = isVideo ? 'video' : 'photo';
        if (isAward) category += ' awards';
        if (isDubai) category += ' dubai';
        if (isIndia) category += ' india';

        processedItems.push({
          id: item.id,
          name: name,
          title: name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          type: isVideo ? 'video' : 'photo',
          category: category.trim(),
          isAward: isAward,
          url: item['@microsoft.graph.downloadUrl'],
          thumbnail: thumbUrl,
          size: item.size,
          createdDateTime: item.createdDateTime
        });
      } else if (item.folder) {
        // Automatically scan subfolders like "Awards", "Dubai Conclave", etc.
        try {
          const subUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userEmail)}/drive/items/${item.id}/children?$expand=thumbnails&$top=999`;
          const subRes = await fetch(subUrl, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          if (subRes.ok) {
            const subData = await subRes.json();
            const folderName = item.name;
            const isAwardFolder = /award|trophy|honour|honor|gala/i.test(folderName);
            const isDubaiFolder = /dubai|uae/i.test(folderName);
            const isIndiaFolder = /india|bangalore|bengaluru|delhi/i.test(folderName);

            for (const subItem of (subData.value || [])) {
              const subName = subItem.name || '';
              const subMime = subItem.file?.mimeType || '';

              if (isImageFile(subName, subMime) || isVideoFile(subName, subMime)) {
                const subIsVideo = isVideoFile(subName, subMime);
                let subCategory = subIsVideo ? 'video' : 'photo';
                if (isAwardFolder || /award|trophy|honour|honor/i.test(subName)) subCategory += ' awards';
                if (isDubaiFolder || /dubai|uae/i.test(subName)) subCategory += ' dubai';
                if (isIndiaFolder || /india|bangalore|bengaluru/i.test(subName)) subCategory += ' india';

                processedItems.push({
                  id: subItem.id,
                  name: subName,
                  title: subName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                  folder: folderName,
                  type: subIsVideo ? 'video' : 'photo',
                  category: subCategory.trim(),
                  isAward: isAwardFolder || /award|trophy|honour|honor/i.test(subName),
                  url: subItem['@microsoft.graph.downloadUrl'],
                  thumbnail: subItem.thumbnails?.[0]?.large?.url || subItem['@microsoft.graph.downloadUrl'],
                  size: subItem.size,
                  createdDateTime: subItem.createdDateTime
                });
              }
            }
          }
        } catch (subErr) {
          console.warn(`Could not read subfolder ${item.name}:`, subErr);
        }
      }
    }

    memoryCache = {
      items: processedItems,
      timestamp: Date.now(),
      ttl: 5 * 60 * 1000
    };

    return res.status(200).json({
      configured: true,
      cached: false,
      count: processedItems.length,
      items: processedItems
    });

  } catch (error) {
    console.error('Server error in /api/gallery:', error);
    return res.status(500).json({
      configured: true,
      error: 'Unexpected server error while syncing from OneDrive',
      message: error.message
    });
  }
}
