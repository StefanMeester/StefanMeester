/* EDIT THIS FILE: it is the only place you change your name and your projects. */
window.SITE={name:"Stefan Meester",role:"Student Video & Filmmaker",email:"505326@student.firda.nl",instagram:"https://instagram.com/stefan.meester.9",linkedin:"https://www.linkedin.com/in/stefan-meester-042893391"};

/* ADD A PROJECT = copy one block below, paste it at the top of the list, change the values. Do not forget the comma after }.
   title  : name shown on the thumbnail
   date   : "2026-03" (year-month). The newest date is shown first, also on the homepage.
   type   : "video" or "photo"  (these become the Type filter)
   tags   : any words you like, e.g. ["Short film","School"] (these become the Topic filter)
   thumb  : image for the thumbnail, saved in the img folder. Optional for YouTube videos (the YouTube thumbnail is used).
   video  : {id:"abc123"} for YouTube (the part after v= in the link) or {type:"vimeo",id:"123456789"} (Vimeo needs a thumb)
   photos : for photo projects: [{src:"img/name.jpg",alt:"What is in the photo",caption:"Caption"}, ...]
   text   : one or two sentences about the project. role: what you did.
   The Year filter is made from the date automatically. New years and tags appear as filters by themselves. */
window.PROJECTS=[
 {title:"Project title one",date:"2026-03",type:"video",tags:["Short film","School"],video:{id:"aqz-KE-bpKQ"},role:"Camera, edit",text:"Two sentences about the idea and your role. Replace this sample video with your own."},
 {title:"Street portraits",date:"2026-01",type:"photo",tags:["Portrait"],thumb:"img/street-1.jpg",photos:[{src:"img/street-1.jpg",alt:"Describe the photo",caption:"Caption, place, 2026"},{src:"img/street-2.jpg",alt:"Describe the photo",caption:"Caption, place, 2026"}],text:"A series about people in my town."},
 {title:"Interview project",date:"2025-11",type:"video",tags:["Interview","School"],video:{id:"aqz-KE-bpKQ"},role:"Camera, sound",text:"What you filmed, for whom, and what you learned."},
 {title:"Event photos",date:"2025-06",type:"photo",tags:["Event"],thumb:"img/event-1.jpg",photos:[{src:"img/event-1.jpg",alt:"Describe the photo",caption:"Caption, place, 2025"}],text:"Photos from a local event."}
];
