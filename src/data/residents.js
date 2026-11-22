// Optional card fields: description, photo { src, width, height, alt }.
// Assign photographs only after room identification is confirmed.
export const residentRoomGroups = [
  {
    "id": "writing",
    "title": "Сценарно-проектные пространства",
    "items": [
      {
        "id": "team-studio-1",
        "title": "Студия команды №1",
        "icon": "residents/team-studio-1.png",
        "width": 384,
        "height": 257
      },
      {
        "id": "team-studio-2",
        "title": "Студия команды №2",
        "icon": "residents/team-studio-2.png",
        "width": 384,
        "height": 257
      },
      {
        "id": "reference-library",
        "title": "Библиотека референсов",
        "icon": "residents/reference-library.png",
        "width": 384,
        "height": 252
      },
      {
        "id": "script-reading-1",
        "title": "Комната читки сценариев №1",
        "icon": "residents/script-reading-1.png",
        "width": 384,
        "height": 250
      },
      {
        "id": "script-reading-2",
        "title": "Комната читки сценариев №2",
        "icon": "residents/script-reading-2.png",
        "width": 384,
        "height": 250
      },
      {
        "id": "individual-work-1",
        "title": "Кабинет индивидуальной работы №1",
        "icon": "residents/individual-work-1.png",
        "width": 384,
        "height": 277
      },
      {
        "id": "individual-work-2",
        "title": "Кабинет индивидуальной работы №2",
        "icon": "residents/individual-work-2.png",
        "width": 384,
        "height": 248
      },
      {
        "id": "print-room",
        "title": "Кабинет печати",
        "icon": "residents/print-room.png",
        "width": 384,
        "height": 237
      }
    ]
  },
  {
    "id": "rehearsal",
    "title": "Репетиционные помещения",
    "items": [
      {
        "id": "costume-room",
        "title": "Костюмная",
        "icon": "residents/costume-room.png",
        "width": 384,
        "height": 287
      },
      {
        "id": "makeup-room",
        "title": "Гримерная",
        "icon": "residents/makeup-room.png",
        "width": 384,
        "height": 280
      },
      {
        "id": "rehearsal-room",
        "title": "Репетиционная",
        "icon": "residents/rehearsal-room.png",
        "width": 384,
        "height": 277
      }
    ]
  }
];
// Photograph assignments confirmed by the project author.
export const filmingLocationGroups = [
  {
    "id": "restored",
    "title": "Реставрационные интерьеры эпохи",
    "items": [
      {
        "id": "restored-3",
        "title": "Съемочная галерея",
        "photo": {
          "src": "residents/historic-interior.webp",
          "width": 1600,
          "height": 893,
          "alt": "Съемочная галерея"
        }
      },
      {
        "id": "restored-8",
        "title": "Шереметьевский зал",
        "photo": {
          "src": "residents/double-height-hall.webp",
          "width": 1600,
          "height": 1073,
          "alt": "Шереметьевский зал"
        }
      }
    ]
  },
  {
    "id": "conserved",
    "title": "Законсервированные пространства",
    "items": [
      {
        "id": "conserved-1",
        "title": "Вестибюль и главная лестница",
        "photo": {
          "src": "residents/cast-iron-staircase.webp",
          "width": 1600,
          "height": 1192,
          "alt": "Вестибюль и главная лестница"
        }
      }
    ]
  }
];
