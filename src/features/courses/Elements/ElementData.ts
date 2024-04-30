export interface ElementData {
    title: string;
    description: string;
  }
  
  export const elementData: ElementData[] = [
    { title: "title", description: 'Description 1' },
    { title: "sub", description: 'Description 2' },
    { title: "text", description: 'Description 3' },
  ];

//   <option value=>Title</option>
//           <option value=>Sub-title</option>
//           <option value=>Paragraph</option>
//           <option value="slide">Slide</option>
//           <option value="img">Image</option>
//           <option value="quiz">Quiz</option>
//           <option value="list">List</option>
//           <option value="accordion">Accordion</option>
//           <option value="sequence">Sequence</option>
//           <option value="reveal">Reveal</option>
//           <option value="range">Range</option>
//           <option value="dnd">Missing Words</option>