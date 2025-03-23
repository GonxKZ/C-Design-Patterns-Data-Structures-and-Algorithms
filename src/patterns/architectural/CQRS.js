const cqrsPattern = {
  id: 'cqrs',
  name: 'CQRS (Command Query Responsibility Segregation)',
  category: 'architectural',
  description: 'Separa las operaciones de lectura (queries) de las operaciones de escritura (commands) en modelos distintos, permitiendo optimizarlas de forma independiente.',
  theory: {
    background: 'CQRS fue formalizado por Greg Young y se basa en el principio CQS (Command-Query Separation) propuesto por Bertrand Meyer. Se ha vuelto popular en aplicaciones complejas, especialmente cuando se combina con Event Sourcing.',
    problem: 'En aplicaciones con modelos de dominio complejos, utilizar el mismo modelo para operaciones de lectura y escritura puede provocar:  1) Modelos excesivamente complejos que intentan satisfacer ambos tipos de operaciones, 2) Problemas de rendimiento cuando los requisitos de lectura y escritura son muy diferentes, 3) Dificultades para escalar las operaciones de lectura y escritura por separado.',
    solution: 'CQRS divide el modelo de dominio en dos partes: un modelo de comandos para escrituras y un modelo de consultas para lecturas. Estos modelos pueden estar en bases de datos separadas, tener esquemas diferentes, y utilizan operaciones sincronizadas para mantener la consistencia. El modelo de consultas puede estar altamente desnormalizado y optimizado específicamente para las necesidades de visualización.',
    applicability: [
      'Aplicaciones complejas donde las operaciones de lectura y escritura tienen requisitos muy diferentes',
      'Sistemas con alto volumen de lecturas en comparación con las escrituras',
      'Cuando se necesitan múltiples representaciones de los mismos datos para diferentes propósitos',
      'Aplicaciones colaborativas donde muchos usuarios pueden operar en los mismos datos',
      'Sistemas que necesitan escalar de forma independiente las operaciones de lectura y escritura'
    ],
    consequences: [
      'Mayor rendimiento al optimizar operaciones de lectura y escritura por separado',
      'Escalabilidad independiente para lecturas y escrituras',
      'Modelos más simples y enfocados en un solo tipo de operación',
      'Mejor adaptación a los requisitos de consulta específicos de la UI',
      'Mayor complejidad en la arquitectura general del sistema',
      'Eventual consistencia entre modelos que puede complicar la lógica de negocio'
    ]
  },
  notes: 'CQRS no es apropiado para todos los sistemas y debe aplicarse selectivamente. Suele ser más beneficioso en partes específicas de una aplicación que en su totalidad. La implementación puede variar desde una separación lógica simple hasta una separación física completa con bases de datos distintas. CQRS se complementa bien con Event Sourcing, donde los eventos son la fuente de verdad para el modelo de comandos, y las proyecciones de estos eventos alimentan el modelo de consultas. Frameworks como Axon (Java), NServiceBus (.NET) y CQRS.js facilitan la implementación de este patrón.'
};

export default cqrsPattern; 