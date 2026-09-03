export type Product = {
  id: string; name: string; slug: string; category: string; space: string;
  description: string; shortDescription: string; materials: string[]; finish: string;
  dimensions: { width: string; depth: string; height: string };
  images: string[]; customizable: boolean; featured: boolean;
};

const images = {
  desk: 'https://images.pexels.com/photos/3847582/pexels-photo-3847582.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  workspace: 'https://images.pexels.com/photos/8082224/pexels-photo-8082224.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  dining: 'https://images.pexels.com/photos/7195900/pexels-photo-7195900.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  conference: 'https://images.pexels.com/photos/9300726/pexels-photo-9300726.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  office: 'https://images.pexels.com/photos/6794970/pexels-photo-6794970.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
  wood: 'https://images.pexels.com/photos/37178407/pexels-photo-37178407.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
};

export const products: Product[] = [
  { id:'p1', name:'Executive Office Desk', slug:'executive-office-desk', category:'Desks', space:'Office', description:'A composed work surface with purposeful proportions for focused work, meetings and everyday organisation.', shortDescription:'A considered desk for focused work.', materials:['Wood','Laminate'], finish:'Natural oak / custom laminate', dimensions:{width:'1800 mm',depth:'800 mm',height:'750 mm'}, images:[images.desk, images.office], customizable:true, featured:true },
  { id:'p2', name:'Meeting Table 08', slug:'meeting-table-08', category:'Tables', space:'Corporate', description:'A calm centre for conversations, designed to scale from a small team meeting to larger project rooms.', shortDescription:'A generous table for meaningful meetings.', materials:['Wood','Metal'], finish:'Walnut veneer / powder-coated frame', dimensions:{width:'2400 mm',depth:'1100 mm',height:'750 mm'}, images:[images.conference, images.dining], customizable:true, featured:true },
  { id:'p3', name:'Workstation System', slug:'workstation-system', category:'Office', space:'Corporate', description:'A flexible workstation language that brings clarity to shared environments without visual noise.', shortDescription:'Adaptable workstations for teams.', materials:['Laminate','Metal'], finish:'Warm grey laminate / charcoal frame', dimensions:{width:'1400 mm',depth:'700 mm',height:'750 mm'}, images:[images.workspace, images.office], customizable:true, featured:true },
  { id:'p4', name:'Dining Table No. 02', slug:'dining-table-no-02', category:'Dining', space:'Home', description:'An honest, warm table with enough presence for daily meals and long conversations.', shortDescription:'Made for daily rituals.', materials:['Wood'], finish:'Solid ash / clear natural finish', dimensions:{width:'1800 mm',depth:'900 mm',height:'760 mm'}, images:[images.dining, images.wood], customizable:true, featured:true },
  { id:'p5', name:'Executive Chair', slug:'executive-chair', category:'Chairs', space:'Office', description:'Supportive seating with a quiet profile, selected for long working days and meeting rooms.', shortDescription:'Comfort with a calm silhouette.', materials:['Upholstery','Metal'], finish:'Textured fabric / black frame', dimensions:{width:'680 mm',depth:'690 mm',height:'1080 mm'}, images:[images.office, images.workspace], customizable:false, featured:true },
  { id:'p6', name:'Storage Cabinet', slug:'storage-cabinet', category:'Storage', space:'Institutional', description:'A dependable storage piece for documents, materials and the things that keep a space working.', shortDescription:'Order for the everyday.', materials:['Laminate','Metal'], finish:'Oak laminate / concealed hardware', dimensions:{width:'900 mm',depth:'450 mm',height:'1800 mm'}, images:[images.workspace, images.wood], customizable:true, featured:false },
  { id:'p7', name:'Reception Desk', slug:'reception-desk', category:'Desks', space:'Corporate', description:'A confident first point of contact, designed around the flow of people and the practical needs of the front desk.', shortDescription:'A clear welcome to your workplace.', materials:['Wood','Laminate'], finish:'Walnut / stone-grey laminate', dimensions:{width:'2400 mm',depth:'800 mm',height:'1100 mm'}, images:[images.office, images.desk], customizable:true, featured:false },
  { id:'p8', name:'Reading Bench', slug:'reading-bench', category:'Sofas', space:'School', description:'Simple, durable seating for libraries, learning areas and shared spaces.', shortDescription:'Built for daily use.', materials:['Wood','Upholstery'], finish:'Birch / durable woven textile', dimensions:{width:'1400 mm',depth:'450 mm',height:'450 mm'}, images:[images.dining, images.workspace], customizable:true, featured:false },
];

export type Space = { slug:string; name:string; eyebrow:string; description:string; image:string; products:string[]; };
export const spaces: Space[] = [
  {slug:'home', name:'Home', eyebrow:'01 / HOME', description:'Pieces designed around the way you live, from daily dining to the quiet corners you return to.', image:images.dining, products:['Dining Table No. 02','Reading Bench']},
  {slug:'office', name:'Office', eyebrow:'02 / OFFICE', description:'Furniture designed for the way your team works, with considered details that keep the day moving.', image:images.workspace, products:['Executive Office Desk','Executive Chair']},
  {slug:'corporate', name:'Corporate', eyebrow:'03 / CORPORATE', description:'A dependable furniture language for workplaces, meeting rooms and reception areas.', image:images.conference, products:['Meeting Table 08','Reception Desk']},
  {slug:'school', name:'School', eyebrow:'04 / SCHOOL', description:'Built for daily use. Ready for every batch, every lesson and every shared space.', image:images.office, products:['Reading Bench','Storage Cabinet']},
  {slug:'institutional', name:'Institutional', eyebrow:'05 / INSTITUTIONAL', description:'Practical, durable furniture packages developed for the rhythm of institutions.', image:images.wood, products:['Storage Cabinet','Workstation System']},
];

export type Project = {slug:string; title:string; type:string; overview:string; image:string; scope:string[]; materials:string[]; gallery:string[]};
export const projects: Project[] = [
  {slug:'quiet-workplace', title:'A quieter workplace', type:'Corporate', overview:'An editable sample project showing how a consistent furniture language can give a shared workplace more clarity.', image:images.workspace, scope:['Workstations','Meeting table','Storage'], materials:['Laminate','Metal','Upholstery'], gallery:[images.workspace,images.conference,images.wood]},
  {slug:'the-open-classroom', title:'The open classroom', type:'School', overview:'An editable sample project for learning environments where furniture needs to be clear, durable and ready to move with the day.', image:images.office, scope:['Benches','Storage','Teacher desks'], materials:['Wood','Laminate'], gallery:[images.office,images.dining,images.wood]},
  {slug:'room-to-gather', title:'Room to gather', type:'Residential', overview:'An editable sample project focused on warm proportions, honest materials and the everyday rituals around a dining table.', image:images.dining, scope:['Dining table','Seating','Storage'], materials:['Wood','Upholstery'], gallery:[images.dining,images.wood,images.workspace]},
];

export { images };
