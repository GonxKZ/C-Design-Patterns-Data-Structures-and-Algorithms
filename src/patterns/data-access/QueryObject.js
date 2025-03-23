const queryObjectPattern = {
  id: 'query-object',
  name: 'Query Object',
  category: 'data-access',
  description: 'Encapsula consultas a la base de datos en objetos independientes, permitiendo construir, componer y reutilizar consultas de forma estructurada sin exponer los detalles específicos del almacenamiento.',
  theory: {
    background: 'El patrón Query Object fue descrito por Martin Fowler como parte de los patrones de arquitectura empresarial. Representa un enfoque orientado a objetos para construir consultas complejas progresivamente, en lugar de codificarlas directamente como cadenas SQL o expresiones LINQ embebidas en el código de la aplicación.',
    problem: 'El manejo directo de consultas en el código de la aplicación genera varios desafíos: 1) Las consultas complejas pueden ser difíciles de mantener y reutilizar cuando están dispersas por el código, 2) El acoplamiento directo con un lenguaje de consulta específico (como SQL) dificulta cambiar la tecnología de almacenamiento, 3) La construcción dinámica de consultas puede ser propensa a errores y vulnerabilidades como inyección SQL, 4) Es difícil componer y reutilizar fragmentos de consultas comunes, 5) Las capas de negocio acaban mezclándose con detalles específicos de persistencia.',
    solution: 'Implementar objetos específicos dedicados a representar y construir consultas. Estos objetos: a) Proporcionan una API orientada a objetos para definir criterios, ordenación, agrupación y otras características de la consulta, b) Encapsulan la lógica de traducción de estos criterios al lenguaje de consulta específico de la base de datos, c) Permiten componer consultas incrementalmente y combinar fragmentos de consulta reutilizables, d) Abstraen los detalles específicos de la tecnología de almacenamiento de la lógica de negocio que necesita los datos.',
    applicability: [
      'Aplicaciones con consultas complejas que necesitan ser construidas dinámicamente',
      'Sistemas que requieren reutilización de criterios de consulta en diferentes partes de la aplicación',
      'Cuando se busca desacoplar la lógica de negocio de los detalles específicos de consulta',
      'Escenarios donde las consultas necesitan ser componibles, como filtros avanzados en interfaces de usuario',
      'Aplicaciones que podrían necesitar cambiar la tecnología de almacenamiento en el futuro'
    ],
    consequences: [
      'Mayor reutilización de código de consulta y criterios comunes',
      'Encapsulación de la lógica específica de consulta, facilitando cambios en la tecnología subyacente',
      'Mejor protección contra vulnerabilidades como la inyección SQL',
      'Posibilidad de construir consultas complejas de forma incremental y legible',
      'Curva de aprendizaje adicional para desarrolladores acostumbrados a escribir consultas directamente',
      'Posible sobrecarga de rendimiento si no se implementa eficientemente',
      'Riesgo de crear una abstracción demasiado genérica que no aproveche características específicas de la base de datos'
    ]
  },
  notes: 'El patrón Query Object a menudo se implementa como parte de frameworks ORM, como Doctrine QueryBuilder, JPA Criteria API, o LINQ en .NET. Puede combinarse con el patrón Specification para encapsular criterios de negocio reutilizables de forma más declarativa. Es importante diseñar la API del Query Object para que sea intuitiva y expresiva, idealmente proporcionando una experiencia similar a un lenguaje específico de dominio (DSL). En implementaciones avanzadas, se puede considerar la optimización de consultas, como la fusión automática de criterios o la aplicación de índices. Aunque proporciona abstracción, es importante no ocultar completamente las características del almacenamiento subyacente cuando son críticas para el rendimiento.'
};

export default queryObjectPattern; 