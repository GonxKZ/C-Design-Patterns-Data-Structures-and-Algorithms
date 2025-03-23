const daoPattern = {
  id: 'dao',
  name: 'Data Access Object (DAO)',
  category: 'data-access',
  description: 'Abstrae y encapsula el acceso a la fuente de datos mediante una interfaz que oculta los detalles de implementación de la persistencia, facilitando el cambio de mecanismos de almacenamiento.',
  theory: {
    background: 'El patrón DAO surgió en la arquitectura J2EE (ahora Jakarta EE) como una práctica recomendada para aislar la lógica de acceso a datos. Aunque no aparece en los catálogos clásicos de patrones GoF, se ha convertido en un estándar de facto en aplicaciones empresariales. Su objetivo principal es proporcionar una capa de abstracción entre la lógica de negocio y la tecnología específica de persistencia.',
    problem: 'Las aplicaciones que integran directamente el código de acceso a datos en la lógica de negocio enfrentan varios desafíos: 1) Alto acoplamiento con tecnologías específicas de almacenamiento, dificultando cambios futuros, 2) Duplicación de código de acceso a datos en diferentes partes de la aplicación, 3) Dificultad para probar la lógica de negocio sin involucrar la base de datos real, 4) Mezcla de responsabilidades entre negocio y persistencia, violando el principio de responsabilidad única, 5) Complejidad para implementar diferentes estrategias de almacenamiento según el contexto.',
    solution: 'Implementar objetos específicos (DAOs) responsables exclusivamente del acceso a datos, con una interfaz que abstrae los detalles de implementación. Los DAOs: a) Exponen métodos para operaciones de persistencia (crear, leer, actualizar, eliminar) pero ocultan cómo se implementan, b) Encapsulan los detalles específicos de la tecnología de almacenamiento (SQL, ORM, NoSQL, etc.), c) Actúan como intermediarios entre la lógica de negocio y la fuente de datos, d) Trabajan con objetos de transferencia de datos (DTOs) o entidades del dominio para intercambiar información.',
    applicability: [
      'Aplicaciones donde se necesita aislar la lógica de negocio de la tecnología de persistencia específica',
      'Sistemas que podrían necesitar soportar múltiples fuentes de datos o cambiar la implementación de persistencia',
      'Cuando se requiere reducir la duplicación de código de acceso a datos',
      'Escenarios donde se necesita facilitar las pruebas unitarias de la lógica de negocio',
      'Aplicaciones empresariales con requisitos de mantenibilidad y adaptabilidad a largo plazo'
    ],
    consequences: [
      'Desacoplamiento entre la lógica de negocio y los detalles específicos de persistencia',
      'Mayor facilidad para cambiar la tecnología de almacenamiento subyacente',
      'Mejora en las posibilidades de prueba mediante mocks o implementaciones de prueba',
      'Código más mantenible y organizado con responsabilidades claramente separadas',
      'Posible sobrecarga de desarrollo inicial al crear interfaces y clases adicionales',
      'Potencial overhead de rendimiento por la capa de indirección adicional',
      'Riesgo de convertirse en una capa de paso si no se diseña con cuidado'
    ]
  },
  notes: 'El patrón DAO a menudo se utiliza junto con otros patrones como Factory Method (para crear DAOs) y Transfer Object/Data Transfer Object (para transportar datos). Aunque comparte similitudes con el patrón Repository, hay diferencias clave: los DAOs suelen estar más orientados a la persistencia y operan a nivel de tabla o entidad, mientras que los Repositories están más orientados al dominio y representan colecciones de objetos. En implementaciones modernas, los DAOs pueden estar construidos sobre frameworks ORM o utilizar bibliotecas de acceso a datos como JDBC, JPA, ADO.NET o Dapper. Es importante definir interfaces DAO bien diseñadas que no filtren detalles de implementación específicos y considerar el uso de excepciones específicas para problemas de acceso a datos.'
};

export default daoPattern; 