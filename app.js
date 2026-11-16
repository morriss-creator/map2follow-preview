// Map2follow: live example map (zoom, search, filters, pop-ups, routes, you-are-here, seasons, EN/ES), packages and contact form.
(function(){
const $=i=>document.getElementById(i);
const OLD_HASH={kontakt:"contact",paket:"packages",package:"packages",erkunden:"explore",einsatz:"uses",ablauf:"process",upgrade:"why"};
const oh=location.hash.slice(1);if(OLD_HASH[oh]){history.replaceState(null,"","#"+OLD_HASH[oh]);const t=$(OLD_HASH[oh]);t&&t.scrollIntoView()}
const calm=matchMedia("(prefers-reduced-motion:reduce)").matches;

// ---- example park (fictional places), positions in percent of the map image
const CATS={ride:{c:"#ff5a3c",en:"Rides",es:"Atracciones"},food:{c:"#f59a0c",en:"Food",es:"Comida"},service:{c:"#1f8fd6",en:"Service",es:"Servicios"},meet:{c:"#d61f7a",en:"Meeting points",es:"Puntos de encuentro"},place:{c:"#1fb26b",en:"Places",es:"Lugares"}};
const P=[
{id:"entrance",c:"service",ic:"🎟️",x:55.48,y:74.94,en:["Main entrance","Tickets, info and the start of your visit."],es:["Entrada principal","Taquilla, información y punto de partida de tu visita."]},
{id:"parking",c:"service",ic:"🅿️",x:48.11,y:82.9,en:["Parking","Parking right by the lake."],es:["Estacionamiento","Estacionamiento junto al lago."]},
{id:"firstaid",c:"service",ic:"⛑️",x:47.41,y:61.77,en:["First aid","First aid station by the entrance plaza."],es:["Primeros auxilios","Puesto de primeros auxilios junto a la plaza de entrada."]},
{id:"wc1",c:"service",ic:"🚻",x:43.02,y:56.17,en:["Restrooms center","Restrooms in the middle of the park."],es:["Baños centro","Baños en el centro del parque."]},
{id:"wc2",c:"service",ic:"🚻",x:71.23,y:71.48,en:["Restrooms lakeside","Restrooms toward the lake."],es:["Baños junto al lago","Baños hacia el lago."]},
{id:"meetA",c:"meet",ic:"📍",x:50.1,y:64.7,en:["Meeting point A","Entrance plaza. An easy spot to regroup with your family or group."],es:["Punto de encuentro A","Plaza de la entrada. Un lugar fácil para reunirse con tu familia o grupo."]},
{id:"meetB",c:"meet",ic:"📍",x:64.65,y:50.23,en:["Meeting point B","Station square, next to the steam train."],es:["Punto de encuentro B","Plaza de la estación, junto al tren de vapor."]},
{id:"rack",c:"ride",ic:"🚞",x:39.26,y:27.13,en:["Mountain railway","Rack railway through the green north of the park."],es:["Tren de montaña","Tren de cremallera por el norte verde del parque."]},
{id:"steam",c:"ride",ic:"🚂",x:57.21,y:64.75,en:["Steam train","Departs from the station in the center."],es:["Tren de vapor","Sale de la estación en el centro."]},
{id:"cable",c:"ride",ic:"🚠",x:85.53,y:60.01,en:["Cable car","Base station at the east end of the park."],es:["Teleférico","Estación base en el extremo este del parque."]},
{id:"village",c:"place",ic:"🏘️",x:49.05,y:39.42,en:["Storybook village","Small houses, tunnels and play areas."],es:["Aldea de cuentos","Casitas, túneles y zonas de juego."]},
{id:"view",c:"place",ic:"🔭",x:31.48,y:62.47,en:["Lake view","Lookout point with a view over the lake."],es:["Mirador del lago","Mirador con vista sobre el lago."]},
{id:"shop",c:"place",ic:"🛍️",x:37.87,y:45.48,en:["Gift shop","Souvenirs and gifts in the village."],es:["Tienda de regalos","Recuerdos y regalos en la aldea."]},
{id:"crepes",c:"food",ic:"🥞",x:34.71,y:53.15,en:["Crêpe stand","Sweet and savory crêpes."],es:["Puesto de crepas","Crepas dulces y saladas."]},
{id:"buffet",c:"food",ic:"🍴",x:56.45,y:59.01,en:["Station café","Hot meals at the station."],es:["Café de la estación","Comidas calientes en la estación."]},
{id:"snack",c:"food",ic:"🍟",x:75.75,y:50.37,en:["Snack bar","Fries, drinks and ice cream."],es:["Snack bar","Papas fritas, bebidas y helados."]},
{id:"fireworks",c:"place",ic:"🎆",x:63.43,y:81.83,ev:1,en:["Fireworks viewpoint","Event layer: best view of the evening fireworks over the lake."],es:["Mirador de fuegos artificiales","Capa de evento: la mejor vista de los fuegos artificiales sobre el lago."]},
{id:"stage",c:"place",ic:"🎪",x:51.59,y:48.32,ev:1,en:["Event stage","Event layer: shows and music during the event."],es:["Escenario del evento","Capa de evento: espectáculos y música durante el evento."]}];
// numbered signposts in the park; each has its own QR code that opens the map with a you-are-here marker
const SIGNS=[{id:"s1",n:1,x:49.39,y:70.46,en:"Entrance plaza",es:"Plaza de la entrada"},{id:"s2",n:2,x:59.96,y:67.55,en:"Station square",es:"Plaza de la estación"},{id:"s3",n:3,x:47.64,y:50.16,en:"Village gate",es:"Puerta de la aldea"},{id:"s4",n:4,x:75.78,y:61.73,en:"East promenade",es:"Paseo este"}];
// walkway network derived from the map image: path mask (colour segmentation + manual masks), centreline, graph (vertices in percent of the map image)
const GV=[48.44,64.92,48.02,64.53,47.77,64.2,47.46,63.72,47.4,62.85,47.41,61.77,47.51,61.38,47.42,60.97,47.25,60.27,46.89,59.36,46.67,58.65,46.64,58.18,46.65,57.47,46.68,56.75,46.75,56.04,46.98,55.16,47.07,54.57,47.64,54.22,47.97,54.07,48.47,53.94,49.16,53.82,49.54,53.78,50.14,53.88,50.51,53.84,50.97,53.75,51.57,54,51.92,54.13,52.14,54.59,52.43,55.13,52.45,55.77,52.5,56.51,52.64,57.45,52.75,58.42,52.91,59.14,53.02,60.05,52.95,60.94,52.9,61.61,52.62,62.49,52.41,63.15,51.85,63.79,51.42,64.26,50.76,64.48,50.1,64.7,49.54,64.77,48.81,64.87,45.63,52.08,45.72,51.79,46.31,51.31,47.04,50.65,47.64,50.16,48.25,49.73,48.71,49.44,49.41,49.35,49.94,49.29,50.1,49.2,50.76,48.81,51.39,48.33,51.59,48.32,45.63,52.07,45.45,52.44,45.09,52.57,44.66,52.75,44.2,53.17,43.88,53.22,43.56,53.4,43.03,53.73,42.93,53.91,42.72,54.78,53.2,62.66,54.06,62.94,54.73,62.82,55.39,62.71,56,62.16,56.46,61.74,56.59,61.59,56.53,60.9,56.44,60.19,56.44,59.71,56.45,59.01,56.61,58.77,56.6,58.77,56.38,59.04,56.42,59.51,56.58,60.2,56.77,61.13,56.81,62.09,56.86,63.06,57.01,63.79,57.21,64.75,57.3,65.26,57.69,66.06,58.13,66.88,58.5,67.11,59.03,67.37,59.58,67.56,59.96,67.55,60.68,67.56,61.22,67.54,61.92,67.42,62.63,67.37,62.79,67.8,50.7,75.65,50.4,76.24,50.12,76.85,49.78,77.69,49.54,78.31,49.22,79.13,48.98,79.74,48.67,80.56,48.5,81.26,48.28,82.2,48.11,82.9,48.11,82.9,48.48,83.65,48.94,84.59,49.3,85.34,49.8,85.98,50.22,86.4,50.64,86.82,50.94,87.36,51.55,87.68,52.21,87.89,52.87,88.11,53.53,87.93,54.2,87.75,54.86,87.57,55.52,87.22,56.18,86.87,56.84,86.51,57.45,86.15,57.91,85.87,58.37,85.6,58.98,85.24,59.62,84.81,60.1,84.49,60.57,84.17,61.21,83.75,61.8,83.24,62.39,82.73,62.84,82.34,63.43,81.83,40.1,48.03,40.59,48.7,40.97,49.2,41.21,49.89,41.44,50.57,41.8,51.41,42.19,52.23,42.27,52.69,42.25,53.44,42.22,54.19,42.35,54.88,42.45,55.1,42.68,55.52,43.02,56.17,43.17,56.62,43.24,57.62,43.2,58.59,43.03,59.52,42.92,60.21,42.95,60.89,42.95,60.89,42.87,61.11,43,61.67,43.11,62.28,43.11,62.94,42.78,63.34,42.44,63.62,41.95,63.91,41.41,64.14,40.82,64.74,40.32,65.35,39.73,65.71,39.61,65.9,39.42,66.84,39.09,67.7,38.96,67.9,38.44,68.07,38.06,68.11,37.49,68.22,36.77,68.22,36.25,68.21,35.91,68.23,35.41,68.34,35,67.57,34.59,66.8,34.33,65.9,34.11,65.26,33.58,64.56,33.2,64.35,32.66,64.02,32.46,63.99,31.7,64.16,31.15,64.27,31.05,63.76,33.9,48.78,33.78,49.1,33.8,50.08,33.88,50.52,33.97,50.88,34.43,51.57,34.78,52.21,34.71,53.15,34.59,53.8,34.73,54.76,34.78,55.47,34.54,56.11,34.4,56.28,33.84,56.89,33.37,57.21,32.96,57.69,32.56,58.16,32.25,59,31.98,59.59,31.56,60.06,31.42,60.55,31.25,61.28,31.27,62.05,31.48,62.47,31.64,62.86,31.64,63.54,31.05,63.76,19.94,52.92,20.76,53.21,20.61,52.05,20.57,51.22,20.64,50.69,21.13,49.93,21.81,49.63,22.32,49.41,23,49.2,23.51,49.04,24.02,48.88,24.7,48.67,25.03,48.61,25.75,49.05,26.29,49.35,26.93,48.98,27.58,48.6,28.08,48.47,28.6,48.35,29.12,48.21,29.63,47.99,30.13,47.73,30.81,47.39,31.34,47.15,31.7,47.04,32.23,46.94,32.9,46.97,33.47,47.75,33.95,48.38,33.9,48.78,38.19,47.29,37.91,46.9,37.68,46.5,37.42,45.86,37.87,45.48,48.83,36.98,48.6,37.23,48.64,37.68,48.8,38.56,48.94,39.23,49.05,39.42,49.44,40.19,49.77,41,50.12,41.79,50.48,42.38,50.86,42.97,51.18,43.24,51.68,43.57,50.25,41.66,50.21,42.64,50.18,43.36,50.23,44.05,50.26,44.77,50.26,45.48,50.46,46.12,50.68,46.76,50.89,47.4,51.12,47.73,51.44,48.25,51.6,48.35,55.41,27.09,55.73,26.77,56.02,27.03,56.57,27.61,57.12,28.18,57.54,28.58,58.08,29.11,58.62,29.62,59.11,30.35,59.54,30.9,59.25,31.52,59.15,32.45,59.11,33.15,58.89,34,58.69,34.86,58.89,35.71,58.9,36.63,58.91,37.33,59.37,38.18,59.7,38.78,59.96,39.53,60.33,40.59,60.74,41.33,61.17,42.08,61.56,42.87,61.84,43.69,62.05,44.57,62.29,45.37,62.61,46.16,62.85,46.77,63.21,47.62,63.41,48.05,63.71,48.7,64.2,49.46,64.65,50.23,64.96,50.76,65.39,51.47,65.68,52.05,65.93,52.97,66.25,53.85,66.72,54.53,67.31,55.34,67.63,55.26,62.56,44.42,62.87,44.17,63.32,44.57,63.89,45.14,64.45,45.76,64.84,46.23,65.37,46.82,65.88,47.44,66.36,48.18,66.85,48.92,67.3,49.71,67.64,50.3,68.08,51,68.52,51.69,69.03,52.44,69.51,52.88,70.06,53.23,70.58,53.49,71.02,53.82,71.46,54.16,71.86,54.15,72.51,54.06,72.98,53.91,73.53,54.12,73.86,54.38,74.35,55.12,74.76,55.66,75.12,56.27,75.45,56.84,75.17,57.39,70.89,52.6,70.81,52.05,71.36,51.37,71.96,50.77,72.28,50.53,72.66,50.4,73.05,50.27,73.64,50.34,74.18,50.27,74.7,50.22,75.21,50.32,75.75,50.37,76.29,50.54,77,50.42,77.55,50.25,77.96,49.72,78.36,49.22,78.68,48.56,79.02,47.95,79.28,47.21,79.62,47.4,73.43,54.73,73.53,54.26,73.69,53.55,73.76,53.06,73.89,52.35,74.19,51.51,74.43,50.9,74.7,50.05,79.62,47.4,79.88,47.21,80.07,47.32,80.46,47.56,81.02,48.09,81.45,48.44,81.88,49.2,82.32,49.95,82.56,50.58,82.88,51.43,83.11,52.06,83.27,52.94,83.46,54.05,83.68,54.96,83.91,55.86,84.14,56.81,84.37,57.8,84.74,58.67,85.19,59.44,85.53,60.01,85.88,60.8,86.26,61.57,86.89,62.21,87.33,62.73,87.46,63.15,87.61,64.09,87.32,64.99,87.08,65.43,86.82,65.86,86.26,66.29,85.81,66.74,85.81,66.74,85.69,67.08,84.99,67.21,84.31,67.37,83.62,67.58,83.11,67.71,82.43,67.88,81.75,68.02,81.07,68.18,80.38,68.27,79.53,68.33,78.85,68.34,78.19,68.37,77.51,68.34,77,68.3,76.35,68.27,75.85,68.3,75.52,68.35,74.96,67.87,74.44,67.29,75.17,57.39,74.73,57.82,75.01,58.69,75.23,59.32,75.43,60.19,75.58,60.84,75.78,61.73,75.78,62.2,75.66,62.93,75.52,63.41,75.36,64.14,75.73,64.4,75.73,64.4,75.47,64.42,75.02,65.21,74.5,66.16,74.07,66.85,73.54,67.43,72.87,68.12,72.15,68.41,71.38,68.51,63.9,59.83,64.49,59.99,64.48,60.95,64.51,61.9,64.55,62.73,64.74,63.48,64.91,64.14,65.17,64.91,65.58,65.25,66.02,65.6,66.34,65.76,66.83,66,67.37,66.02,67.9,66.03,68.61,66.07,69.17,66.09,69.86,65.78,70.35,65.54,71.08,65.21,71.33,64.79,71.56,64.37,71.85,63.75,72.09,63.02,72.12,62.27,72.13,61.59,72.09,60.9,72,59.98,72,59.3,71.44,64.3,71.81,64.34,72.06,65.21,72.14,65.91,72.14,66.85,71.89,67.56,71.65,68.48,71.43,69.39,71.22,69.75,70.68,70.37,70.89,70.78,63.51,72.27,63.71,72.39,64.24,72.45,64.6,72.45,65.26,72.35,65.91,72.25,66.57,72.14,67.24,72.07,67.92,71.88,68.42,71.67,69.12,71.46,69.65,71.27,70.37,70.99,70.73,71.07,71.23,71.48,71.73,71.87,72.41,71.89,73.07,71.9,73.78,71.84,74.33,71.73,75.06,71.72,75.25,71.52,62.79,67.8,62.84,67.36,63.18,67.24,63.68,67.15,64.09,66.67,64.46,66.1,64.88,65.39,38.19,47.29,38.39,47.22,39.03,47.73,39.53,48.06,39.87,48.2,40.1,48.03,38.98,25.61,39.04,26.28,39.26,27.13,39.46,27.77,39.6,28.37,39.95,29.1,40.32,29.87,40.58,30.6,41.07,31.14,41.49,31.58,42.06,32.1,42.69,32.6,43.34,33.17,44.11,33.12,44.47,33.02,45.01,32.79,45.54,32.46,46.13,32.16,46.41,31.79,46.65,31.4,46.97,30.76,47.12,29.75,47.22,29.03,47.29,28.09,47.33,27.39,47.48,27.2,48.44,64.92,48.64,65.37,48.94,66.03,48.98,66.51,49.06,67.23,49.19,67.7,49.38,68.41,49.17,68.69,49.17,68.69,49.28,69.57,49.39,70.46,49.5,71.34,49.67,72.23,49.8,72.89,49.93,73.56,50.1,74.45,50.1,74.45,50.54,74.77,50.98,75.1,51.42,75.42,51.97,75.39,52.52,75.36,53.07,75.33,53.76,75.22,54.28,75.13,54.79,75.05,55.48,74.94,47.48,27.2,47.86,27.77,48.11,28.16,48.35,28.75,48.67,29.54,48.8,30.22,48.98,31.13,49.02,31.82,49.06,32.73,49.06,32.73,49.03,33.67,49,34.38,48.95,35.33,48.9,36.03,48.83,36.98,50.28,49.2,50.87,49.68,51.36,49.9,51.68,50.05,52.28,50.58,52.87,51.12,53.28,51.97,53.68,52.8,54.12,53.79,54.5,54.56,54.88,55.39,55.16,56.2,55.45,57.01,55.57,57.55,55.91,58.3,56.15,58.69,56.6,58.77],GE=[0,556,0,1,1,2,2,3,3,4,4,5,252,253,253,254,254,255,255,256,252,524,257,258,258,259,259,260,260,261,261,262,257,597,161,162,162,163,163,164,164,165,165,166,166,167,167,168,168,169,169,170,170,171,171,172,172,173,173,174,174,175,175,176,176,177,177,178,178,179,179,180,180,181,181,182,182,183,183,184,184,185,185,186,186,187,187,188,188,189,189,190,190,191,191,192,192,193,193,194,160,161,591,592,590,591,589,590,588,589,587,588,586,587,585,586,584,585,583,584,592,593,593,594,594,595,595,596,596,597,88,89,89,90,90,91,91,92,92,93,93,94,94,95,87,88,86,87,85,86,84,85,83,84,82,83,81,82,80,81,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34,35,35,36,36,37,262,263,263,264,264,265,508,509,494,508,493,494,492,493,491,492,507,508,506,507,505,506,504,505,503,504,502,503,501,502,500,501,499,500,498,499,497,498,496,497,495,496,509,510,510,511,511,512,512,513,513,514,514,515,515,516,265,266,266,267,267,268,268,269,265,270,270,271,271,272,272,273,273,274,274,275,275,276,276,277,277,278,278,279,279,280,280,281,342,343,343,344,344,345,345,346,346,347,347,348,342,355,355,356,356,357,357,358,358,359,359,360,360,361,361,362,362,363,363,364,341,342,340,341,339,340,338,339,337,338,336,337,335,336,334,335,333,334,332,333,331,332,330,331,329,330,328,329,327,328,326,327,325,326,308,325,95,96,96,97,97,98,98,99,99,100,348,376,376,377,377,378,378,379,379,380,380,381,381,382,382,383,364,383,348,349,349,350,350,351,351,352,352,353,353,354,100,517,517,518,518,519,519,520,520,521,521,522,522,523,463,523,435,436,436,437,437,438,438,439,439,440,440,441,354,435,524,525,525,526,526,527,527,528,528,529,57,281,282,283,283,284,284,285,285,286,286,287,287,288,288,289,289,290,290,291,291,292,292,293,293,294,294,295,295,296,296,297,297,298,298,299,299,300,300,301,301,302,302,303,303,304,304,305,305,306,306,307,307,308,441,442,442,443,443,444,444,445,445,446,141,529,530,531,531,532,111,112,110,111,109,110,108,109,107,108,106,107,105,106,104,105,103,104,102,103,101,102,101,574,112,113,113,114,114,115,115,116,116,117,117,118,118,119,119,120,120,121,121,122,122,123,123,124,124,125,125,126,126,127,127,128,128,129,129,130,130,131,131,132,132,133,133,134,134,135,135,136,136,137,137,138,138,139,139,140,194,221,195,251,195,196,196,197,197,198,198,199,199,200,200,201,201,202,364,365,365,366,446,447,447,448,448,449,449,450,450,451,80,614,79,614,613,614,612,613,611,612,610,611,609,610,608,609,607,608,606,607,605,606,604,605,603,604,602,603,601,602,600,601,599,600,598,599,54,598,532,533,533,534,534,535,535,536,536,537,537,538,538,539,539,540,540,541,541,542,542,543,543,544,544,545,545,546,546,547,547,548,548,549,549,550,550,551,551,552,552,553,553,554,554,555,366,367,367,368,368,369,369,370,370,371,371,372,372,373,373,374,374,375,451,452,452,453,453,454,454,455,455,491,434,451,433,434,432,433,431,432,430,431,429,430,428,429,427,428,426,427,425,426,424,425,423,424,422,423,421,422,420,421,419,420,418,419,417,418,416,417,415,416,202,203,203,204,204,205,205,206,206,207,207,208,208,209,209,210,210,211,211,212,212,213,213,214,214,215,215,216,216,217,217,218,37,38,38,39,39,40,40,41,41,42,37,68,68,69,69,70,70,71,71,72,72,73,73,74,74,75,75,76,76,77,77,78,375,384,456,457,457,458,458,459,459,460,460,461,461,462,462,463,42,43,43,44,44,556,384,385,385,386,386,387,387,388,388,389,389,390,390,391,391,392,392,393,393,394,394,395,395,396,396,397,397,398,398,399,399,400,400,401,401,402,402,403,45,46,46,47,47,48,48,49,45,58,463,464,464,465,465,466,466,467,467,468,468,469,469,470,470,471,471,472,472,473,473,474,474,475,475,476,218,219,219,220,220,221,49,50,50,51,51,52,52,53,53,54,222,223,223,224,224,225,225,226,226,227,227,228,228,229,229,230,230,231,231,232,232,233,233,234,234,235,235,236,236,237,237,238,238,239,239,240,240,241,241,242,242,243,243,244,244,245,245,246,246,247,247,248,248,249,249,250,250,251,555,583,556,557,557,558,558,559,559,560,560,561,561,562,562,563,308,309,309,310,310,311,311,312,312,313,313,314,314,315,315,316,54,55,55,56,56,57,563,564,58,59,59,60,60,61,61,62,62,63,63,64,64,65,65,66,66,67,67,152,564,565,565,566,476,477,477,478,478,479,479,480,480,481,481,482,482,483,476,484,484,485,485,486,486,487,487,488,488,489,489,490,490,491,566,567,567,568,568,569,569,570,570,571,141,142,142,143,143,144,144,145,145,146,146,147,147,148,148,149,149,150,150,151,151,152,316,317,317,318,318,319,319,320,320,321,321,322,322,323,323,324,403,404,404,405,405,406,406,407,407,408,408,409,409,410,410,411,411,412,412,413,413,414,571,572,572,573,573,574,574,575,575,576,576,577,577,578,578,579,579,580,580,581,581,582,152,153,153,154,154,155,155,156,156,157,157,158,158,159,159,160,414,415,79,80,78,79];
const TOUR=["entrance","steam","snack","cable","buffet","village","rack"];
const T={en:{all:"All",search:"Search for a place",where:"Where to?",tap:"Tap a place on the map, in the list or search for it.",route:"Route from here",routeE:"Route from the entrance",here:"You are here",hereAt:"You are here: Signpost",scan:"Simulate a QR scan at a signpost:",tour:"Suggested route: highlights tour",tourT:"Highlights tour",tourD:"A suggested loop past the main rides and food stops.",routeTo:"Suggested route to",from:"from",entr:"the entrance",spr:"Spring",sum:"Summer",fall:"Fall",win:"Winter",ev:"Event layer",zin:"Zoom in",zout:"Zoom out",zres:"Reset view",close:"Close",none:"No place found.",sign:"Signpost",photo:"Photo of"},
 es:{all:"Todo",search:"Buscar un lugar",where:"¿A dónde vas?",tap:"Toca un lugar en el mapa, en la lista o búscalo.",route:"Ruta desde aquí",routeE:"Ruta desde la entrada",here:"Estás aquí",hereAt:"Estás aquí: Señal",scan:"Simula un escaneo QR en una señal:",tour:"Ruta sugerida: recorrido destacado",tourT:"Recorrido destacado",tourD:"Un circuito sugerido por las principales atracciones y paradas de comida.",routeTo:"Ruta sugerida a",from:"desde",entr:"la entrada",spr:"Primavera",sum:"Verano",fall:"Otoño",win:"Invierno",ev:"Capa de evento",zin:"Acercar",zout:"Alejar",zres:"Restablecer vista",close:"Cerrar",none:"No se encontró ningún lugar.",sign:"Señal",photo:"Foto de"}};
let lang="en",cat="all",cur=null,season="sum",ev=false,here=null,q="",tour=false;
const t=k=>T[lang][k],nm=p=>p[lang][0],ds=p=>p[lang][1];
const rw=$("rwrap"),zl=$("zl"),pinsBox=$("pins"),rsvg=$("route"),pop=$("pop");
if(!rw)return;
// pins and signposts
P.forEach(p=>{const b=document.createElement("button");b.type="button";b.className="rpin";b.dataset.id=p.id;b.style.cssText=`--c:${CATS[p.c].c};left:${p.x}%;top:${p.y}%`;b.innerHTML=`${p.ic}<span class="l"></span>`;b.onclick=e=>{e.stopPropagation();select(p.id,true)};pinsBox.appendChild(b)});
SIGNS.forEach(s=>{const d=document.createElement("span");d.className="sgn";d.dataset.id=s.id;d.style.cssText=`left:${s.x}%;top:${s.y}%`;d.textContent=s.n;d.setAttribute("aria-hidden","true");pinsBox.appendChild(d)});
const hm=document.createElement("span");hm.className="here";hm.hidden=true;hm.innerHTML='<i></i><b></b>';pinsBox.appendChild(hm);
// controls
const mkChip=(box,k,label,fn,cls="chip")=>{const b=document.createElement("button");b.type="button";b.className=cls;b.dataset.k=k;b.onclick=fn;box.appendChild(b);return b};
["all",...Object.keys(CATS)].forEach(k=>mkChip($("cats"),k,"",()=>{cat=k;tour=false;if(cur&&k!=="all"&&P.find(x=>x.id===cur).c!==k)cur=null;render()}));
const loadSeason=k=>{const im=zl.querySelector(`img.sl[data-s="${k}"]`);if(im&&!im.getAttribute("srcset"))im.setAttribute("srcset",im.dataset.srcset)};
["spr","sum","fall","win"].forEach(k=>mkChip($("seas"),k,"",()=>{loadSeason(k);season=k;render()}));
mkChip($("seas"),"ev","",()=>{ev=!ev;if(!ev&&cur&&P.find(x=>x.id===cur).ev)cur=null;render()});
mkChip($("tourbox"),"tour","",()=>{tour=!tour;if(tour){cur=null;view(1,50,50)}render()});
SIGNS.forEach(s=>mkChip($("scan"),s.id,"",()=>setHere(s.id,true),"chip sm"));
document.querySelectorAll("#langs button").forEach(b=>b.onclick=()=>{lang=b.dataset.l;render()});
$("q").addEventListener("input",e=>{q=e.target.value.trim().toLowerCase();render()});
$("q").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const f=visible()[0];if(f)select(f.id,true)}});
// zoom and pan
let z=1,tx=0,ty=0;
function clamp(){const W=rw.clientWidth,H=rw.clientHeight;tx=Math.min(0,Math.max(W-W*z,tx));ty=Math.min(0,Math.max(H-H*z,ty))}
function apply(){clamp();zl.style.transform=`translate(${tx}px,${ty}px) scale(${z})`;zl.style.setProperty("--z",z);rw.classList.toggle("zoomed",z>1.01)}
function view(nz,cx,cy){const W=rw.clientWidth,H=rw.clientHeight;z=Math.max(1,Math.min(4,nz));tx=W/2-cx/100*W*z;ty=H/2-cy/100*H*z;apply();placePop()}
function zoomAt(f,px,py){const nz=Math.max(1,Math.min(4,z*f));tx=px-(px-tx)*nz/z;ty=py-(py-ty)*nz/z;z=nz;apply();placePop()}
$("zin").onclick=()=>zoomAt(1.5,rw.clientWidth/2,rw.clientHeight/2);
$("zout").onclick=()=>zoomAt(1/1.5,rw.clientWidth/2,rw.clientHeight/2);
$("zres").onclick=()=>{z=1;tx=ty=0;apply();placePop()};
rw.addEventListener("wheel",e=>{if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();const r=rw.getBoundingClientRect();zoomAt(e.deltaY<0?1.2:1/1.2,e.clientX-r.left,e.clientY-r.top)},{passive:false});
const pts=new Map();let pinch=0,moved=false;
rw.addEventListener("pointerdown",e=>{if(e.target.closest(".rpin,.pop,.zc"))return;pts.set(e.pointerId,[e.clientX,e.clientY]);moved=false;rw.setPointerCapture(e.pointerId)});
rw.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;const [px,py]=pts.get(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);
 if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);const r=rw.getBoundingClientRect();if(pinch)zoomAt(d/pinch,(a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top);pinch=d;moved=true;return}
 if(z>1){tx+=e.clientX-px;ty+=e.clientY-py;if(Math.abs(e.clientX-px)+Math.abs(e.clientY-py)>1)moved=true;apply();placePop()}});
const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=0};
rw.addEventListener("pointerup",up);rw.addEventListener("pointercancel",up);
rw.addEventListener("click",e=>{if(moved||e.target.closest(".rpin,.pop,.zc"))return;cur=null;render()});
addEventListener("resize",()=>{apply();placePop()});
// routes
const NV=GV.length/2,KY=1344/1800,AD=Array.from({length:NV},()=>[]),vx=i=>[GV[2*i],GV[2*i+1]];
for(let i=0;i<GE.length;i+=2){const a=GE[i],b=GE[i+1],w=Math.hypot(GV[2*a]-GV[2*b],(GV[2*a+1]-GV[2*b+1])*KY);AD[a].push([b,w]);AD[b].push([a,w])}
function nearest(x,y){let b=0,d=1e9;for(let i=0;i<NV;i++){const dd=Math.hypot(GV[2*i]-x,(GV[2*i+1]-y)*KY);if(dd<d){d=dd;b=i}}return b}
// shortest walk along the paths (Dijkstra)
function path(a,b){const D=new Float64Array(NV).fill(Infinity),pr=new Int32Array(NV).fill(-1),done=new Uint8Array(NV);D[a]=0;
 for(;;){let u=-1;for(let i=0;i<NV;i++)if(!done[i]&&D[i]<Infinity&&(u<0||D[i]<D[u]))u=i;if(u<0||u===b)break;done[u]=1;for(const [v,w] of AD[u])if(D[u]+w<D[v]){D[v]=D[u]+w;pr[v]=u}}
 const o=[b];while(o[0]!==a&&pr[o[0]]>=0)o.unshift(pr[o[0]]);return o.map(vx)}
const startPt=()=>{const s=SIGNS.find(x=>x.id===here);return s?[s.x,s.y]:[55.48,74.94]};
function routeTo(p){const s=startPt();return [s,...path(nearest(...s),nearest(p.x,p.y)),[p.x,p.y]]}
function smoothD(l){const q=l.filter((p,i)=>!i||Math.hypot(p[0]-l[i-1][0],p[1]-l[i-1][1])>.05);if(q.length<3)return "M"+q.map(p=>p.join(",")).join("L");
 const f=n=>n.toFixed(2);let d=`M${q[0][0]},${q[0][1]}`;for(let i=1;i<q.length-1;i++){d+=`Q${q[i][0]},${q[i][1]} ${f((q[i][0]+q[i+1][0])/2)},${f((q[i][1]+q[i+1][1])/2)}`}return d+`L${q[q.length-1][0]},${q[q.length-1][1]}`}
function fit(l){if(!l.length)return;const xs=l.map(q=>q[0]),ys=l.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 view(Math.max(1,Math.min(2.5,.8*Math.min(100/Math.max(1,x1-x0),100/Math.max(1,y1-y0)))),(x0+x1)/2,(y0+y1)/2)}
function draw(list){if(!list.length){rsvg.innerHTML="";return}const d=smoothD(list);rsvg.innerHTML=`<path d="${d}" class="rb"/><path d="${d}" class="rl"/>`}
let showRoute=false;
// you are here
function setHere(id,focus){here=id;const s=SIGNS.find(x=>x.id===id);if(!s)return;hm.hidden=false;hm.style.left=s.x+"%";hm.style.top=s.y+"%";
 if(focus){view(2,s.x,s.y)}render()}
// selection and popup
function select(id,focus){cur=id;tour=false;showRoute=false;const p=P.find(x=>x.id===id);if(focus&&z>1)view(z,p.x,p.y);render()}
function placePop(){if(!cur||pop.hidden)return;const p=P.find(x=>x.id===cur);const W=rw.clientWidth,H=rw.clientHeight;let x=tx+p.x/100*W*z,y=ty+p.y/100*H*z;
 const pw=pop.offsetWidth,ph=pop.offsetHeight;let left=Math.max(8,Math.min(W-pw-8,x-pw/2)),top=y-ph-26;if(top<8)top=Math.min(H-ph-8,y+26);pop.style.left=left+"px";pop.style.top=top+"px"}
const visible=()=>P.filter(p=>(!p.ev||ev)&&(cat==="all"||p.c===cat)&&(!q||nm(p).toLowerCase().includes(q)||ds(p).toLowerCase().includes(q)));
function render(){
 document.documentElement.lang=lang==="es"?"es":"en";
 document.querySelectorAll("#langs button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.l===lang));
 document.querySelectorAll("#cats .chip").forEach(b=>{b.textContent=b.dataset.k==="all"?t("all"):CATS[b.dataset.k][lang];b.setAttribute("aria-pressed",b.dataset.k===cat)});
 document.querySelectorAll("#seas .chip").forEach(b=>{b.textContent=t(b.dataset.k);b.setAttribute("aria-pressed",b.dataset.k==="ev"?ev:b.dataset.k===season)});
 const tb=document.querySelector("#tourbox .chip");tb.textContent=t("tour");tb.setAttribute("aria-pressed",tour);
 document.querySelectorAll("#scan .chip").forEach(b=>{const s=SIGNS.find(x=>x.id===b.dataset.k);b.textContent=`${t("sign")} ${s.n}`;b.setAttribute("aria-pressed",here===s.id);b.setAttribute("aria-label",`${t("sign")} ${s.n}: ${s[lang]}`)});
 $("scanL").textContent=t("scan");$("q").placeholder=t("search");$("qL").textContent=t("search");
 $("zin").setAttribute("aria-label",t("zin"));$("zout").setAttribute("aria-label",t("zout"));$("zres").setAttribute("aria-label",t("zres"));
 rw.dataset.season=season;rw.classList.toggle("event",ev);
 const vis=new Set(visible().map(p=>p.id));
 document.querySelectorAll(".rpin").forEach(g=>{const p=P.find(x=>x.id===g.dataset.id);g.hidden=p.ev&&!ev;g.querySelector(".l").textContent=nm(p);g.setAttribute("aria-label",nm(p));g.classList.toggle("sel",g.dataset.id===cur);g.classList.toggle("dim",!vis.has(p.id)&&p.id!==cur)});
 if(here){const s=SIGNS.find(x=>x.id===here);hm.querySelector("b").textContent=t("here")}
 // list
 const L=$("list");L.replaceChildren();const v=visible();
 if(!v.length){const e=document.createElement("p");e.className="note";e.textContent=t("none");L.appendChild(e)}
 v.forEach(p=>{const b=document.createElement("button");b.type="button";b.className="item";b.setAttribute("aria-pressed",p.id===cur);b.innerHTML=`<i style="background:${CATS[p.c].c}"></i><span>${p.ic} ${nm(p)}</span>`;b.onclick=()=>select(p.id,true);L.appendChild(b)});
 // info + popup + route
 const p=P.find(x=>x.id===cur);
 const hs=here?SIGNS.find(x=>x.id===here):null;
 const hereTxt=hs?`<p class="hereinfo">📍 ${t("hereAt")} ${hs.n} · ${hs[lang]}</p>`:"";
 if(tour){const pts=[];let a=TOUR[0];TOUR.slice(1).forEach(id=>{const A=P.find(x=>x.id===a),B=P.find(x=>x.id===id);pts.push([A.x,A.y],...path(nearest(A.x,A.y),nearest(B.x,B.y)),[B.x,B.y]);a=id});draw(pts);
  $("info").innerHTML=`<b>🧭 ${t("tourT")}</b><span>${t("tourD")}</span>${hereTxt}`;pop.hidden=true;return}
 if(p&&showRoute){draw(routeTo(p))}else draw([]);
 if(!p){$("info").innerHTML=`<b>${t("where")}</b><span>${t("tap")}</span>${hereTxt}`;pop.hidden=true;return}
 $("info").innerHTML=`<b>${p.ic} ${nm(p)}</b><span>${CATS[p.c][lang]}. ${ds(p)}</span>${showRoute?`<p class="hereinfo">🧭 ${t("routeTo")} ${nm(p)} ${t("from")} ${hs?t("sign")+" "+hs.n:t("entr")}</p>`:hereTxt}`;
 pop.hidden=showRoute;if(showRoute)return;
 pop.innerHTML=`<div class="ph" role="img" aria-label="${t("photo")} ${nm(p)}" style="background-position:${p.x}% ${p.y}%"></div><div class="pb"><b>${p.ic} ${nm(p)}</b><span>${ds(p)}</span><button type="button" class="rbtn">${hs?t("route"):t("routeE")}</button></div><button type="button" class="px" aria-label="${t("close")}">×</button>`;
 pop.querySelector(".rbtn").onclick=e=>{e.stopPropagation();showRoute=true;render();fit(routeTo(p))};
 pop.querySelector(".px").onclick=e=>{e.stopPropagation();cur=null;render()};
 placePop()}
render();
// QR deep link: ?here=s2 (or #here=s2) opens the map with a you-are-here marker at that signpost
const hp=new URLSearchParams(location.search).get("here")||(location.hash.match(/here=(s\d)/)||[])[1];
if(hp&&SIGNS.some(s=>s.id===hp)){$("explore").scrollIntoView();setTimeout(()=>setHere(hp,true),60)}

// ---- hero parallax and scroll reveal
const hv=$("hv");
if(hv&&!calm&&matchMedia("(pointer:fine)").matches){const h=document.querySelector(".hero");let raf=0;
 h.addEventListener("pointermove",e=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=h.getBoundingClientRect();hv.style.setProperty("--mx",((e.clientX-r.left)/r.width-.5).toFixed(3));hv.style.setProperty("--my",((e.clientY-r.top)/r.height-.5).toFixed(3))})});
 h.addEventListener("pointerleave",()=>{hv.style.setProperty("--mx",0);hv.style.setProperty("--my",0)})}
const rv=document.querySelectorAll(".rv");
if(calm||!("IntersectionObserver" in window))rv.forEach(e=>e.classList.add("in"));
else{const io=new IntersectionObserver(en=>en.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{rootMargin:"0px 0px -8% 0px"});rv.forEach(e=>io.observe(e))}

// ---- packages and add-ons
let pkg=null,sketch=false;const addons=new Set();
const reqText=()=>[sketch?"Request: Free live preview":"",pkg?`Package: ${pkg.n} ($${pkg.p})`:"",addons.size?`Add-ons (price on request): ${[...addons].join(", ")}`:""].filter(Boolean).join("\n");
function syncReq(){const s=$("selPkg");const t=reqText();s.hidden=!t;s.textContent=t.replace(/\n/g," · ");
 const w=$("w");const rest=w.value.split("\n").filter(l=>!/^(Request|Package|Add-ons)/.test(l)).join("\n").trim();w.value=[t,rest].filter(Boolean).join("\n")}
document.querySelectorAll("[data-pkg],[data-sketch]").forEach(a=>a.addEventListener("click",()=>{if(a.dataset.pkg)pkg={n:a.dataset.pkg,p:a.dataset.price};if(a.dataset.sketch!==undefined)sketch=true;syncReq();setTimeout(()=>$("n").focus({preventScroll:true}),400)}));
document.querySelectorAll(".addon").forEach(b=>b.addEventListener("click",()=>{const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);on?addons.add(b.textContent):addons.delete(b.textContent);syncReq()}));
const names=()=>[pkg?pkg.n+" package":"",...addons].filter(Boolean);
// ---- contact
// To send directly without opening an email program, put a form endpoint here
// (e.g. a Formspree or Web3Forms URL) and update the privacy policy. Left empty, the request opens as an email draft.
const FORM_ENDPOINT="";
const TO="map2follow@gmail.com";
$("f").addEventListener("submit",e=>{e.preventDefault();
 const t=`${sketch?"Free live preview request":"Park map request"}\nPark: ${$("n").value||"-"}\nContact: ${$("e").value||"-"}\nPackage: ${pkg?pkg.n+" ($"+pkg.p+")":"-"}\nAdd-ons: ${[...addons].join(", ")||"-"}\nWishes: ${$("w").value||"-"}\n\nOur current map is attached.`;
 const st=$("st");
 if(FORM_ENDPOINT){
  fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({park:$("n").value,email:$("e").value,message:t})})
   .then(r=>{if(!r.ok)throw 0;st.textContent="Thank you, your request was sent. We will get back to you.";$("f").reset()}).catch(()=>{st.textContent="Sending failed. Please email us at map2follow@gmail.com."});
  return}
 try{navigator.clipboard.writeText(t).catch(()=>{})}catch(_){}
 st.textContent="Your email program opens with the request. Please attach your current map and send it. The text was also copied.";
 location.href="mailto:"+TO+"?subject="+encodeURIComponent((sketch?"Free live preview request":"Park map request")+(pkg?" ("+pkg.n+" package)":"")+": "+($("n").value||""))+"&body="+encodeURIComponent(t)});
// close the mobile menu after choosing a link
document.querySelectorAll(".mmp a").forEach(a=>a.addEventListener("click",()=>a.closest("details").open=false));
})();
