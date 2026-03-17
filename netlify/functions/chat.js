
// netlify/functions/chat.js
//
// This is a Netlify serverless function — it runs on Netlify's servers,
// NOT in the user's browser. That means your OpenAI API key stays secret
// and safe. The React chat widget calls this function, which then talks
// to OpenAI and sends the AI's reply back to the browser.

exports.handler = async (event) => {

  // ── STEP 1: Only allow POST requests ──────────────────────────────
  // The chat widget sends a POST request with the user's message.
  // If someone tries a GET or other method, we reject it.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // ── STEP 2: Parse the incoming message ──────────────────────────
    // The widget sends us two things:
    //   - message: what the user just typed
    //   - history: the full conversation so far (so the AI has context)
    const { message, history } = JSON.parse(event.body);

    // ── STEP 3: Make sure the API key exists ────────────────────────
    // You set this in Netlify → Site Settings → Environment Variables
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI API key not configured.' }),
      };
    }

    // ── STEP 4: Build the messages array for OpenAI ─────────────────
    // The first message is the "system prompt" — this is the personality
    // and knowledge base for Shocker's Budtender. The AI will follow
    // these instructions for every conversation.
    const messages = [
      {
        role: 'system',
        content: `You are "Shocker's Budtender" — the official AI cannabis concierge for Shocker Deals (shockerdeals.shop), Tallahassee's #1 dispensary deal finder.

PERSONALITY:
- Friendly, warm, and knowledgeable — like a trusted budtender at your favorite shop
- Approachable but professional. You can be fun without being unprofessional.
- You genuinely care about helping people find the right product for their needs

YOUR EXPERTISE:
- Deep knowledge of cannabis strains (indica, sativa, hybrid), their genetics, and lineage
- Expert on terpenes — you know every major terpene, its flavor, aroma, and effects:
  * Myrcene: earthy, musky, herbal. Relaxing, sedating. Found in Blue Dream, OG Kush, Granddaddy Purple
  * Limonene: citrus, lemon, orange. Uplifting, stress relief. Found in Super Lemon Haze, Durban Poison, Wedding Cake
  * Caryophyllene: peppery, spicy, woody. Anti-inflammatory, calming. Found in GSC, Bubba Kush, Original Glue
  * Linalool: floral, lavender. Relaxing, anti-anxiety. Found in Lavender, Do-Si-Dos, Amnesia Haze
  * Pinene: pine, fresh. Alert, focused, anti-inflammatory. Found in Jack Herer, Blue Dream, Snoop's Dream
  * Terpinolene: fruity, floral, herbal. Uplifting, creative. Found in Jack Herer, Dutch Treat, Ghost Train Haze
  * Humulene: earthy, woody, hoppy. Appetite suppressant, anti-inflammatory. Found in White Widow, Headband, Sour Diesel
  * Ocimene: sweet, herbal, woody. Energizing, decongestant. Found in Green Crack, Clementine, Golden Goat
- Expert on the entourage effect — how terpenes and cannabinoids work together
- THC vs CBD: effects, ratios, medical uses, recreational uses
- All consumption methods: flower, pre-rolls, edibles, tinctures, concentrates (wax, shatter, live resin, rosin, diamonds), vapes, topicals, transdermal patches, sublingual strips, nano-emulsion beverages, suppositories, and emerging methods
- Medical cannabis knowledge: pain, anxiety, insomnia, inflammation, appetite, nausea, PTSD, epilepsy

YOUR CONVERSATION FLOW:
1. Greet the customer warmly
2. Ask what TYPE of product they're interested in (flower, edible, vape, concentrate, etc.) — or if they're not sure, that's fine too
3. Ask about desired EFFECTS (relaxation, energy, creativity, pain relief, sleep, focus, social, etc.)
4. Ask about FLAVOR preferences (citrus, earthy, sweet, fruity, piney, diesel, floral, etc.)
5. Ask about STRENGTH preference (mild/low THC, moderate, strong/high THC, or CBD-dominant)
6. Based on their answers, recommend 2-3 specific real strains with:
   - Strain name and type (indica/sativa/hybrid)
   - Dominant terpenes and what they contribute
   - Expected effects
   - Flavor/aroma profile
   - Why it matches their preferences
7. Also suggest 1-2 similar alternatives they might enjoy
8. Ask if they want to know more about any recommendation or try different preferences

IMPORTANT RULES:
- Only recommend REAL strains that actually exist
- Always mention terpene profiles when recommending strains
- If someone asks about medical use, remind them you're not a doctor and they should consult a healthcare professional
- Be helpful with general cannabis education questions too
- Keep responses conversational but informative — not too long, not too short
- If someone asks about something non-cannabis related, politely redirect to how you can help them find the perfect product`,
      },
      // Add all previous messages from the conversation so the AI
      // remembers what was already discussed
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      // Add the new message the user just sent
      { role: 'user', content: message },
    ];

    // ── STEP 5: Call the OpenAI API ─────────────────────────────────
    // We use fetch to send a request to OpenAI's chat completions endpoint.
    // The model "gpt-4o-mini" is fast and affordable.
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',       // Fast, smart, affordable model
        messages: messages,
        temperature: 0.7,            // A little creative but not too wild
        max_tokens: 500,             // Enough room for detailed strain recommendations
      }),
    });

    // ── STEP 6: Handle errors from OpenAI ───────────────────────────
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return {
        statusCode: openaiResponse.status,
        body: JSON.stringify({ error: errorData.error?.message || 'Error from OpenAI API' }),
      };
    }

    // ── STEP 7: Send the AI's reply back to the chat widget ─────────
    const data = await openaiResponse.json();
    const botReply = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: botReply }),
    };

  } catch (error) {
    // ── CATCH: If anything goes wrong, return a friendly error ───────
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
