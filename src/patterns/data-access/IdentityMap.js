const identityMapPattern = {
  id: 'identity-map',
  name: 'Identity Map',
  category: 'data-access',
  description: 'Mantiene un registro en memoria de todos los objetos cargados desde la base de datos, asegurando que cada entidad se cargue solo una vez y proporcionando una caché de identidad para evitar duplicados.',
  theory: {
    background: 'El patrón Identity Map fue catalogado por Martin Fowler en "Patterns of Enterprise Application Architecture" como una solución al problema de la duplicación de objetos en memoria. Este patrón se utiliza habitualmente en los frameworks ORM (Object-Relational Mapping) para garantizar la consistencia de los objetos en memoria y mejorar el rendimiento.',
    problem: 'Cuando se cargan datos desde la base de datos en una aplicación, pueden surgir varios problemas: 1) La misma entidad puede cargarse múltiples veces, creando duplicados en memoria con estados potencialmente inconsistentes, 2) Actualizaciones a un objeto no se reflejan en sus duplicados, causando comportamientos inesperados, 3) Se desperdician recursos de memoria manteniendo múltiples copias del mismo objeto, 4) Complejidad para mantener la identidad y la igualdad de las entidades de dominio, 5) Posibles condiciones de carrera al actualizar el mismo registro desde diferentes instancias del objeto.',
    solution: 'Implementar un registro en memoria (el Identity Map) que mantiene un mapa de los objetos ya cargados, indexados por su identidad (generalmente su clave primaria). Cuando se necesita cargar un objeto: a) Primero se verifica en el mapa si ya ha sido cargado, b) Si está en el mapa, se devuelve la instancia existente, c) Si no está en el mapa, se carga desde la base de datos, se agrega al mapa y luego se devuelve, d) El mapa garantiza que cada entidad existe como un único objeto en memoria durante una sesión o transacción.',
    applicability: [
      'Sistemas que cargan el mismo objeto múltiples veces durante una sesión o transacción',
      'Aplicaciones donde la consistencia de las entidades en memoria es crítica',
      'Cuando se necesita optimizar el rendimiento reduciendo consultas redundantes a la base de datos',
      'En conjunción con patrones como Unit of Work para seguimiento de cambios',
      'Aplicaciones con relaciones complejas entre objetos donde la identidad de referencia es importante'
    ],
    consequences: [
      'Garantiza que cada entidad de la base de datos está representada por un único objeto en memoria',
      'Mantiene la consistencia al asegurar que las actualizaciones a un objeto afectan a todas las referencias',
      'Mejora el rendimiento al evitar cargas innecesarias desde la base de datos',
      'Simplifica la comparación de identidad entre objetos de dominio',
      'Consume memoria adicional para mantener el mapa de objetos',
      'Puede complicar la gestión del ciclo de vida de los objetos si no se diseña correctamente',
      'Potenciales problemas si el scope del mapa no está bien definido (por ejemplo, en aplicaciones web)'
    ]
  },
  notes: 'El patrón Identity Map es implementado internamente por muchos frameworks ORM como Hibernate (con su concepto de sesión), Entity Framework (DbContext), y SqlAlchemy. Es particularmente útil cuando se trabaja con grafos de objetos complejos con muchas referencias cruzadas. El alcance del Identity Map suele estar ligado a una unidad de trabajo o sesión, y debería limpiarse al finalizar esta para evitar fugas de memoria. En aplicaciones multi-hilo, se debe considerar la sincronización del acceso al mapa o asegurar que cada hilo tenga su propio contexto. Este patrón se complementa bien con Lazy Loading para cargar datos bajo demanda y con Unit of Work para coordinar la persistencia de múltiples objetos relacionados.'
};

export default identityMapPattern; 