export interface ElementData {
    title: string;
    description: string;
    value:string;
  }
  
  export const elementData: ElementData[] = [
    { title: "Title", description: 'Description 1' ,value:"title"},
    { title: "Sub Title", description: 'Description 2' ,value:"sub"},
    { title: "Paragraph", description: 'Description 3' ,value:"text"},
    { title: "List", description: 'Description 1',value:"list" },
    { title: "Slide", description: 'Description 1', value:"slide" },
    { title: "Image", description: 'Description 2',value:"img" },
    { title: "Quiz", description: 'Description 3',value:"quiz" },
    { title: "Accordion", description: 'Description 2' ,value:"accordion"},
    { title: "Sequence", description: 'Description 3' ,value:"sequence"},
    { title: "Reveal", description: 'Description 1',value:"reveal" },
    { title: "Range", description: 'Description 2' ,value:"range"},
    { title: "Missing Words", description: 'Description 3' ,value:"dnd"},
  ];