import React, { useState } from 'react';

interface BookNameMapping {
  [key: string]: string;
}

const bookNameMapping: BookNameMapping = {
  'ኦሪት ዘፍጥረት': 'ኦሪት ዘፍጥረት',
  'ዘፍ': 'ኦሪት ዘፍጥረት',
  'ኦሪት ዘጸአት': 'ኦሪት ዘጸአት',
  'ዘጸ': 'ኦሪት ዘጸአት',
  'ኦሪት ዘሌዋውያን': 'ኦሪት ዘሌዋውያን',
  'ዘሌ': 'ኦሪት ዘሌዋውያን',
  'ኦሪት ዘኍልቍ': 'ኦሪት ዘኍልቍ',
  'ዘኍ': 'ኦሪት ዘኍልቍ',
  'ኦሪት ዘዳግም': 'ኦሪት ዘዳግም',
  'ዘዳ': 'ኦሪት ዘዳግም',
  'መጽሐፈ ኢያሱ ወልደ ነዌ': 'መጽሐፈ ኢያሱ ወልደ ነዌ',
  'ኢያ': 'መጽሐፈ ኢያሱ ወልደ ነዌ',
  'ኢያሱ': 'መጽሐፈ ኢያሱ ወልደ ነዌ',
  'መጽሐፈ መሣፍንት': 'መጽሐፈ መሣፍንት',
  'መሣ': 'መጽሐፈ መሣፍንት',
  'መሳ': 'መጽሐፈ መሣፍንት',
  'መጽሐፈ ሩት': 'መጽሐፈ ሩት',
  'ሩት': 'መጽሐፈ ሩት',
  'መጽሐፈ ሳሙኤል ቀዳማዊ': 'መጽሐፈ ሳሙኤል ቀዳማዊ',
  '1 ሳሙ': 'መጽሐፈ ሳሙኤል ቀዳማዊ',
  '1ኛ ሳሙ': 'መጽሐፈ ሳሙኤል ቀዳማዊ',
  'መጽሐፈ ሳሙኤል ካልዕ': 'መጽሐፈ ሳሙኤል ካልዕ',
  '2 ሳሙ': 'መጽሐፈ ሳሙኤል ካልዕ',
  '2ኛ ሳሙ': 'መጽሐፈ ሳሙኤል ካልዕ',
  'መጽሐፈ ነገሥት ቀዳማዊ': 'መጽሐፈ ነገሥት ቀዳማዊ',
  '1 ነገ': 'መጽሐፈ ነገሥት ቀዳማዊ',
  '1ኛ ነገ': 'መጽሐፈ ነገሥት ቀዳማዊ',
  'መጽሐፈ ነገሥት ካልዕ': 'መጽሐፈ ነገሥት ካልዕ',
  '2 ነገ': 'መጽሐፈ ነገሥት ካልዕ',
  '2ኛ ነገ': 'መጽሐፈ ነገሥት ካልዕ',
  'መጽሐፈ ዜና መዋዕል ቀዳማዊ': 'መጽሐፈ ዜና መዋዕል ቀዳማዊ',
  '1 ዜና': 'መጽሐፈ ዜና መዋዕል ቀዳማዊ',
  '1ኛ ዜና': 'መጽሐፈ ዜና መዋዕል ቀዳማዊ',
  'መጽሐፈ ዜና መዋዕል ካልዕ': 'መጽሐፈ ዜና መዋዕል ካልዕ',
  '2 ዜና': 'መጽሐፈ ዜና መዋዕል ካልዕ',
  '2ኛ ዜና': 'መጽሐፈ ዜና መዋዕል ካልዕ',
  'መጽሐፈ ዕዝራ': 'መጽሐፈ ዕዝራ',
  'ዕዝ': 'መጽሐፈ ዕዝራ',
  'ዕዝራ': 'መጽሐፈ ዕዝራ',
  'መጽሐፈ ነህምያ': 'መጽሐፈ ነህምያ',
  'ነህ': 'መጽሐፈ ነህምያ',
  'ነህምያ': 'መጽሐፈ ነህምያ',
  'መጽሐፈ አስቴር': 'መጽሐፈ አስቴር',
  'አስ': 'መጽሐፈ አስቴር',
  'አስቴር': 'መጽሐፈ አስቴር',
  'መጽሐፈ ኢዮብ': 'መጽሐፈ ኢዮብ',
  'ኢዮ': 'መጽሐፈ ኢዮብ',
  'ኢዮብ': 'መጽሐፈ ኢዮብ',
  'መዝሙረ ዳዊት': 'መዝሙረ ዳዊት',
  'መዝ': 'መዝሙረ ዳዊት',
  'መዝሙር': 'መዝሙረ ዳዊት',
  'መጽሐፈ ምሳሌ': 'መጽሐፈ ምሳሌ',
  'ምሳ': 'መጽሐፈ ምሳሌ',
  'ምሳሌ': 'መጽሐፈ ምሳሌ',
  'መጽሐፈ መክብብ': 'መጽሐፈ መክብብ',
  'መክ': 'መጽሐፈ መክብብ',
  'መክብብ': 'መጽሐፈ መክብብ',
  'መኃልየ መኃልይ ዘሰሎሞን': 'መኃልየ መኃልይ ዘሰሎሞን',
  'መኃ': 'መኃልየ መኃልይ ዘሰሎሞን',
  'መኃልየ': 'መኃልየ መኃልይ ዘሰሎሞን',
  'ትንቢተ ኢሳይያስ': 'ትንቢተ ኢሳይያስ',
  'ኢሳ': 'ትንቢተ ኢሳይያስ',
  'ኢሳይያስ': 'ትንቢተ ኢሳይያስ',
  'ትንቢተ ኤርምያስ': 'ትንቢተ ኤርምያስ',
  'ኤርም': 'ትንቢተ ኤርምያስ',
  'ኤርምያስ': 'ትንቢተ ኤርምያስ',
  'ሰቆቃው ኤርምያስ': 'ሰቆቃው ኤርምያስ',
  'ሰቆ': 'ሰቆቃው ኤርምያስ',
  'ትንቢተ ሕዝቅኤል': 'ትንቢተ ሕዝቅኤል',
  'ሕዝ': 'ትንቢተ ሕዝቅኤል',
  'ሕዝቅኤል': 'ትንቢተ ሕዝቅኤል',
  'ትንቢተ ዳንኤል': 'ትንቢተ ዳንኤል',
  'ዳን': 'ትንቢተ ዳንኤል',
  'ዳንኤል': 'ትንቢተ ዳንኤል',
  'ትንቢተ ሆሴዕ': 'ትንቢተ ሆሴዕ',
  'ሆሴ': 'ትንቢተ ሆሴዕ',
  'ሆሴዕ': 'ትንቢተ ሆሴዕ',
  'ትንቢተ ኢዮኤል': 'ትንቢተ ኢዮኤል',
  'ኢዮኤል': 'ትንቢተ ኢዮኤል',
  'ትንቢተ አሞጽ': 'ትንቢተ አሞጽ',
  'አሞ': 'ትንቢተ አሞጽ',
  'አሞጽ': 'ትንቢተ አሞጽ',
  'አሞፅ': 'ትንቢተ አሞጽ',
  'ትንቢተ አብድዩ': 'ትንቢተ አብድዩ',
  'አብ': 'ትንቢተ አብድዩ',
  'አብድዩ': 'ትንቢተ አብድዩ',
  'ትንቢተ ዮናስ': 'ትንቢተ ዮናስ',
  'ዮና': 'ትንቢተ ዮናስ',
  'ዮናስ': 'ትንቢተ ዮናስ',
  'ትንቢተ ሚክያስ': 'ትንቢተ ሚክያስ',
  'ሚክ': 'ትንቢተ ሚክያስ',
  'ሚክያስ': 'ትንቢተ ሚክያስ',
  'ትንቢተ ናሆም': 'ትንቢተ ናሆም',
  'ናሆ': 'ትንቢተ ናሆም',
  'ናሆም': 'ትንቢተ ናሆም',
  'ትንቢተ ዕንባቆም': 'ትንቢተ ዕንባቆም',
  'ዕን': 'ትንቢተ ዕንባቆም',
  'ዕንባቆም': 'ትንቢተ ዕንባቆም',
  'ትንቢተ ሶፎንያስ': 'ትንቢተ ሶፎንያስ',
  'ሶፎ': 'ትንቢተ ሶፎንያስ',
  'ሶፎንያስ': 'ትንቢተ ሶፎንያስ',
  'ትንቢተ ሐጌ': 'ትንቢተ ሐጌ',
  'ሐጌ': 'ትንቢተ ሐጌ',
  'ትንቢተ ዘካርያስ': 'ትንቢተ ዘካርያስ',
  'ዘካ': 'ትንቢተ ዘካርያስ',
  'ዘካርያስ': 'ትንቢተ ዘካርያስ',
  'ትንቢተ ሚልክያ': 'ትንቢተ ሚልክያ',
  'ሚል': 'ትንቢተ ሚልክያ',
  'ሚልክያስ': 'ትንቢተ ሚልክያ',
  'የማቴዎስ ወንጌል': 'የማቴዎስ ወንጌል',
  'ማቴ': 'የማቴዎስ ወንጌል',
  'ማቴዎስ': 'የማቴዎስ ወንጌል',
  'የማርቆስ ወንጌል': 'የማርቆስ ወንጌል',
  'ማር': 'የማርቆስ ወንጌል',
  'ማርቆስ': 'የማርቆስ ወንጌል',
  'የሉቃስ ወንጌል': 'የሉቃስ ወንጌል',
  'ሉቃ': 'የሉቃስ ወንጌል',
  'ሉቃስ': 'የሉቃስ ወንጌል',
  'የዮሐንስ ወንጌል': 'የዮሐንስ ወንጌል',
  'ዮሐ': 'የዮሐንስ ወንጌል',
  'ዮሐንስ': 'የዮሐንስ ወንጌል',
  'የሐዋርያት ሥራ': 'የሐዋርያት ሥራ',
  'ሐዋ': 'የሐዋርያት ሥራ',
  'የሐዋ': 'የሐዋርያት ሥራ',
  'ወደ ሮሜ ሰዎች': 'ወደ ሮሜ ሰዎች',
  'ሮሜ': 'ወደ ሮሜ ሰዎች',
  '1ኛ ወደ ቆሮንቶስ ሰዎች': '1ኛ ወደ ቆሮንቶስ ሰዎች',
  '1 ቆሮ': '1ኛ ወደ ቆሮንቶስ ሰዎች',
  '1ኛ ቆሮ': '1ኛ ወደ ቆሮንቶስ ሰዎች',
  '2ኛ ወደ ቆሮንቶስ ሰዎች': '2ኛ ወደ ቆሮንቶስ ሰዎች',
  '2 ቆሮ': '2ኛ ወደ ቆሮንቶስ ሰዎች',
  '2ኛ ቆሮ': '2ኛ ወደ ቆሮንቶስ ሰዎች',
  'ወደ ገላትያ ሰዎች': 'ወደ ገላትያ ሰዎች',
  'ገላ': 'ወደ ገላትያ ሰዎች',
  'ገላትያ': 'ወደ ገላትያ ሰዎች',
  'ወደ ኤፌሶን ሰዎች': 'ወደ ኤፌሶን ሰዎች',
  'ኤፌ': 'ወደ ኤፌሶን ሰዎች',
  'ኤፌሶን': 'ወደ ኤፌሶን ሰዎች',
  'ወደ ፊልጵስዩስ ሰዎች': 'ወደ ፊልጵስዩስ ሰዎች',
  'ፊል': 'ወደ ፊልጵስዩስ ሰዎች',
  'ወደ ቆላስያ ሰዎች': 'ወደ ቆላስያስ ሰዎች',
  'ቆላ': 'ወደ ቆላስያስ ሰዎች',
  'ቆላስያስ': 'ወደ ቆላስያስ ሰዎች',
  '1ኛ ወደ ተሰሎንቄ ሰዎች': '1ኛ ወደ ተሰሎንቄ ሰዎች',
  '1 ተሰ': '1ኛ ወደ ተሰሎንቄ ሰዎች',
  '1ኛ ተሰ': '1ኛ ወደ ተሰሎንቄ ሰዎች',
  '2ኛ ወደ ተሰሎንቄ ሰዎች': '2ኛ ወደ ተሰሎንቄ ሰዎች',
  '2 ተሰ': '2ኛ ወደ ተሰሎንቄ ሰዎች',
  '2ኛ ተሰ': '2ኛ ወደ ተሰሎንቄ ሰዎች',
  '1ኛ ወደ ጢሞቴዎስ': '1ኛ ወደ ጢሞቴዎስ',
  '1 ጢሞ': '1ኛ ወደ ጢሞቴዎስ',
  '1ኛ ጢሞ': '1ኛ ወደ ጢሞቴዎስ',
  '2 ኛ ወደ ጢሞቴዎስ': '2ኛ ወደ ጢሞቴዎስ',
  '2 ጢሞ': '2ኛ ወደ ጢሞቴዎስ',
  '2ኛ ጢሞ': '2ኛ ወደ ጢሞቴዎስ',
  'ወደ ቲቶ': 'ወደ ቲቶ',
  'ቲቶ': 'ወደ ቲቶ',
  'ወደ ፊልሞና': 'ወደ ፊልሞና',
  'ፊልሞና': 'ወደ ፊልሞና',
  'ወደ ዕብራውያን': 'ወደ ዕብራውያን',
  'ዕብ': 'ወደ ዕብራውያን',
  'ዕብራውያን': 'ወደ ዕብራውያን',
  'ያዕ': 'የያዕቆብ መልእክት',
  'ያዕቆብ': 'የያዕቆብ መልእክት',
  '1 ጴጥ': '1ኛ የጴጥሮስ መልእክት',
  '1ኛ ጴጥ': '1ኛ የጴጥሮስ መልእክት',
  'ከጴጥሮስ 2ኛ': '2ኛ የጴጥሮስ መልእክት',
  '2 ጴጥ': '2ኛ የጴጥሮስ መልእክት',
  '2ኛ ጴጥ': '2ኛ የጴጥሮስ መልእክት',
  '1 ዮሐ': '1ኛ የዮሐንስ መልእክት',
  '1ኛ ዮሐ': '1ኛ የዮሐንስ መልእክት',
  '2 ዮሐ': '2ኛ የዮሐንስ መልእክት',
  '2ኛ ዮሐ': '2ኛ የዮሐንስ መልእክት',
  '3 ዮሐ': '3ኛ የዮሐንስ መልእክት',
  '3ኛ ዮሐ': '3ኛ የዮሐንስ መልእክት',
  'ይሁዳ': 'የይሁዳ መልእክት',
  'ይሁ': 'የይሁዳ መልእክት',
  'ራእይ': 'የዮሐንስ ራእይ',
  'ራእ': 'የዮሐንስ ራእይ',
  'ራዕይ': 'የዮሐንስ ራእይ',
  'ራዕ': 'የዮሐንስ ራእይ'
};
interface ParsedVerseInput {
  book: string;
  chapter: number;
  verse: number;
}

function parseVerseInput(input: string): ParsedVerseInput {
  const parts = input.split(' ');
  const bookParts = [];
  let chapterVerse = '';

  for (let i = 0; i < parts.length; i++) {
    if (isNaN(parseInt(parts[i], 10))) {
      bookParts.push(parts[i]);
    } else {
      chapterVerse = parts.slice(i).join(' ');
      break;
    }
  }

  const book = bookNameMapping[bookParts.join(' ')] || bookParts.join(' ');
  const [chapterStr, verseStr] = chapterVerse.split(':');
  const chapter = parseInt(chapterStr, 10);
  const verse = parseInt(verseStr, 10);

  return { book, chapter, verse };
}

interface Verse {
  text: string;
}

async function fetchBibleVerses(input: string): Promise<Verse[]> {
  const { book, chapter, verse } = parseVerseInput(input);

  try {
    const response = await fetch(`http://localhost:5100/bible/${book}/${chapter}/${verse}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error fetching Bible verses:', errorData);
      throw new Error('Failed to fetch Bible verses');
    }

    const data = await response.json();
    console.log('Bible verses response:', data);
    return [data];
  } catch (error) {
    console.error('Error fetching Bible verses:', error);
    throw error;
  }
}

const BibleVerseDisplay: React.FC = () => {
  const [verseInput, setVerseInput] = useState('');
  const [verseData, setVerseData] = useState<Verse[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await fetchBibleVerses(verseInput);
    setVerseData(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={verseInput}
          onChange={(e) => setVerseInput(e.target.value)}
          placeholder="Enter verse (e.g., ኦሪት ዘፍጥረት 1:1)"
        />
        <button type="submit">Fetch Verses</button>
      </form>

      <div>
        {verseData.map((verse, index) => (
          <p key={index}>{verse.text}</p>
        ))}
      </div>
    </div>
  );
};

export default BibleVerseDisplay;