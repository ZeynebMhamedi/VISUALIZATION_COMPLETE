// Données représentant la forêt d'arbres.
export let arbres = [
  {
    id: 1,
    name: "Arbre 1",
    accuracy: 0.92,
    children: [
      {
        name: "x1",
        children: [
          { name: "x2" },
          {
            name: "x11",
            children: [
              { name: "x4" },
              { name: "x5" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Arbre 2",
    accuracy: 0.4,
    children: [
      {
        name: "x6",
        children: [
          {
            name: "x3",
            children: [
              { name: "x10" },
              { name: "x8" },
            ],
          },
          {
            name: "x7",
            children: [
              { name: "x2" },
              { name: "x4" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Arbre 3",
    accuracy: 0.7,
    children: [
      {
        name: "x8",
        children: [
          {
            name: "x4",
            children: [
              { name: "x1" },
              { name: "x11" },
            ],
          },
          {
            name: "x5",
            children: [
              { name: "x4" },
              { name: "x2" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Arbre 4",
    accuracy: 0.8,
    children: [
      {
        name: "x2",
        children: [
          {
            name: "x1",
            children: [
              { name: "x4" },
              { name: "x3" },
              { name: "x7" },
              { name: "x6" },
              { name: "x10" },
            ],
          },
          { name: "x8" },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Arbre 5",
    accuracy: 0.6,
    children: [
      {
        name: "x3",
        children: [
          {
            name: "x6",
            children: [
              { name: "x11" },
              { name: "x5" },
              { name: "x2" },
              { name: "x7" },
            ],
          },
          { name: "x8" },
          { name: "x1" },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Arbre 6",
    accuracy: 0.2,
    children: [
      {
        name: "x3",
        children: [
          {
            name: "x6",
            children: [
              { name: "x1" },
              { name: "x5" },
              { name: "x2" },
              { name: "x7" },
            ],
          },
          { name: "x8" ,
              children: [
              { name: "x1" },
              { name: "x5" },
                ],
      },
    ],
  },
    ]
  },
  {
    id: 7,
    name: "Arbre 7",
    accuracy: 0.86,
    children: [
      {
        name: "x1",
        children: [
          { name: "x2" },
          { name: "x7" },
          {
            name: "x3",
            children: [
              { name: "x4" },
              { name: "x5" },
              { name: "x6" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Arbre 8",
    accuracy: 0.89,
    children: [
      {
        name: "x1",
        children: [
          { name: "x2" },
          { name: "x7" },
          {
            name: "x3",
            children: [
              { name: "x9" },
              { name: "x5" },
              { name: "x6" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 9,
    name: "Arbre 9",
    accuracy: 0.69,
    children: [
      {
        name: "x1",
        children: [
          { name: "x2" },
          { name: "x7" },
          {
            name: "x3",
            children: [
              { name: "x4" },
              { name: "x5" },
              { name: "x6" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 10,
    name: "Arbre 10",
    accuracy: 0.90,
    children: [
      {
        name: "x1",
        children: [
          { name: "x2" },
          { name: "x7" },
          {
            name: "x3",
            children: [
              { name: "x4" },
              { name: "x9" },
              { name: "x6" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 11,
    name: "Arbre 11",
    accuracy: 0.22,
    children: [
      {
        name: "x10",
        children: [
          { name: "x2" },
          { name: "x7" },
          {
            name: "x11",
            children: [
              { name: "x5" },
              { name: "x9" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 12,
    name: "Arbre 12",
    accuracy: 0.78,
    children: [
      {
        name: "x4",
        children: [
          { name: "x1" },
          { name: "x2" },
          { name: "x6" },
        ],
      },
    ],
  },
  {
    id: 13,
    name: "Arbre 13",
    accuracy: 0.95,
    children: [
      {
        name: "x3",
        children: [
          { name: "x8" },
          { name: "x9" },
          { name: "x10" },
          { name: "x11" },
        ],
      },
    ],
  },
  {
    id: 14,
    name: "Arbre 14",
    accuracy: 0.65,
    children: [
      {
        name: "x5",
        children: [
          { name: "x6" },
          { name: "x7" },
          { name: "x9" },
        ],
      },
    ],
  },
  {
    id: 15,
    name: "Arbre 15",
    accuracy: 0.83,
    children: [
      {
        name: "x2",
        children: [
          { name: "x1" },
          { name: "x3" },
          { name: "x4" },
          { name: "x6" },
        ],
      },
    ],
  },

  {
    id: 16,
    name: "Arbre 12",
    accuracy: 0.75,
    children: [
      {
        name: "x9",
        children: [
          {
            name: "x7",
            children: [
              { name: "x6" },
              { name: "x5" },
              { name: "x4" },
            ],
          },
          { name: "x3" },
        ],
      },
    ],
  },
  {
    id: 17,
    name: "Arbre 13",
    accuracy: 0.53,
    children: [
      {
        name: "x6",
        children: [
          { name: "x3" },
          { name: "x4" },
          {
            name: "x5",
            children: [
              { name: "x9" },
              { name: "x7" },
              { name: "x2" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 18,
    name: "Arbre 14",
    accuracy: 0.20,
    children: [
      {
        name: "x1",
        children: [
          {
            name: "x2",
            children: [
              { name: "x6" },
              { name: "x7" },
              { name: "x5" },
            ],
          },
          { name: "x3" },
        ],
      },
    ],
  },
  
];
