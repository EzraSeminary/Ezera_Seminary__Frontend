export interface ElementData {
    title: string;
    description: string;
    value:string;
  }
  
  export const elementData: ElementData[] = [
    { title: "Title", description: 'Introduce the lesson' ,value:"title"},
    { title: "Sub Title", description: 'Show a sub-title' ,value:"sub"},
    { title: "Paragraph", description: 'Show long-form text' ,value:"text"},
    { title: "Bulleted list", description: 'Show a list of bullet points',value:"list" },
    { title: "Horizontal series", description: 'Show text blocks in order', value:"slide" },
    { title: "Image", description: 'Show a single image',value:"img" },
    { title: "Multiple choice", description: 'Show answers in a list',value:"quiz" },
    { title: "Expandable list", description: 'Show a list of concepts' ,value:"accordion"},
    { title: "Sequence", description: 'Show a sequence of text' ,value:"sequence"},
    { title: "Reveal", description: 'Show a list of concepts',value:"reveal" },
    { title: "Slider", description: 'Select a single value' ,value:"range"},
    { title: "Missing Words", description: 'Fill the missing words' ,value:"dnd"},
    { title: "Scroll Mix", description: 'Show a mix of text and media' ,value:"mix"},
    { title: "Audio", description: 'Add an audio file' ,value:"audio"},
  ];