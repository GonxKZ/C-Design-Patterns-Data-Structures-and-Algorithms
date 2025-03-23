const activeRecordPattern = {
  id: 'active-record',
  name: 'Active Record',
  category: 'data-access',
  description: 'Combina la representación de datos y la lógica de persistencia en el mismo objeto, encapsulando el acceso a la base de datos y añadiendo lógica de dominio a esos datos.',
  theory: {
    background: 'El patrón Active Record fue descrito por Martin Fowler en su libro "Patterns of Enterprise Application Architecture". Se basa en la idea de que un objeto no solo debería representar un registro de datos, sino también contener la lógica para interactuar con la fuente de datos. Este enfoque tiene sus raíces en el diseño orientado a objetos tradicional que busca encapsular tanto datos como comportamiento.',
    problem: 'El desarrollo de aplicaciones con persistencia de datos presenta varios desafíos: 1) Necesidad de trasladar datos entre representaciones en memoria y fuentes de datos, 2) Complejidad para mantener sincronizados objetos y registros de base de datos, 3) Riesgo de duplicar lógica de acceso a datos entre diferentes partes del sistema, 4) Dificultad para manejar la complejidad cuando se necesita tanto interactuar con la base de datos como implementar lógica de negocio.',
    solution: 'Implementar clases que encapsulan tanto una fila en una tabla de base de datos (o documento, en bases NoSQL) como los métodos para interactuar con los datos (insertar, actualizar, eliminar, consultar). Una clase Active Record: a) Proporciona getters/setters para acceder a los campos de la tabla, b) Implementa métodos para operaciones CRUD sobre sus propios datos, c) Puede incluir lógica de dominio y validación relacionada con esos datos, d) Mapea casi directamente a la estructura de la base de datos, actuando como un espejo de ella.',
    applicability: [
      'Aplicaciones con modelos de dominio simples que se alinean bien con el esquema de base de datos',
      'Proyectos que priorizan la rapidez de desarrollo y la simplicidad sobre la flexibilidad arquitectónica',
      'Sistemas donde la lógica de negocio está estrechamente ligada a los datos persistidos',
      'Aplicaciones CRUD básicas donde los objetos representan principalmente datos con comportamiento simple',
      'Prototipos o aplicaciones pequeñas donde la sobrecarga de capas adicionales no se justifica'
    ],
    consequences: [
      'Simplicidad conceptual y facilidad de uso para operaciones CRUD básicas',
      'Desarrollo rápido debido a la reducción de código repetitivo',
      'Encapsulación natural de datos y comportamiento relacionado en una única clase',
      'Mayor acoplamiento entre el modelo de dominio y el esquema de base de datos',
      'Dificultad para probar la lógica de negocio de forma aislada sin interactuar con la base de datos',
      'Limitaciones para evolucionar independientemente el modelo de dominio y la estructura de datos',
      'Potenciales problemas con modelos de dominio complejos que no mapean bien a tablas individuales'
    ]
  },
  notes: 'El patrón Active Record es ampliamente utilizado en frameworks como Ruby on Rails, Laravel (Eloquent), y Django (aunque con variaciones). Es más adecuado para aplicaciones donde la lógica de dominio no es excesivamente compleja y hay una correspondencia natural entre objetos y tablas. Para sistemas con lógica de dominio rica y compleja, el patrón Data Mapper suele ofrecer mejor desacoplamiento. Active Record puede considerarse en cierto modo opuesto a la filosofía de Data Mapper: mientras este último separa el modelo de dominio de la persistencia, Active Record los integra estrechamente. En aplicaciones con ambas necesidades, es posible utilizar Active Record para entidades simples y Data Mapper para aquellas con dominio más complejo.'
};

export default activeRecordPattern; 