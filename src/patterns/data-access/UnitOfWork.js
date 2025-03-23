const unitOfWorkPattern = {
  id: 'unit-of-work',
  name: 'Unit of Work',
  category: 'data-access',
  description: 'Agrupa un conjunto de operaciones de modificación de datos en una única transacción, manteniendo el seguimiento de los cambios y coordinando su persistencia atómica.',
  theory: {
    background: 'El patrón Unit of Work fue formalizado por Martin Fowler en su libro "Patterns of Enterprise Application Architecture". Surgió como una solución para gestionar transacciones complejas y mantener la consistencia de los datos en sistemas empresariales, especialmente cuando múltiples operaciones deben ser tratadas como una unidad atómica.',
    problem: 'Al trabajar con persistencia de datos, frecuentemente surgen desafíos como: 1) Necesidad de mantener la coherencia entre múltiples operaciones relacionadas, 2) Dificultad para rastrear qué objetos han sido modificados durante una operación de negocio, 3) Complejidad en la gestión de transacciones y el control de concurrencia, 4) Ineficiencia al realizar múltiples operaciones individuales de base de datos, 5) Riesgo de datos inconsistentes si algunas operaciones fallan mientras otras se completan.',
    solution: 'Implementar un coordinador que mantenga registro de todos los objetos afectados durante una transacción de negocio y orqueste su persistencia como una unidad. Este coordinador: a) Registra objetos nuevos, modificados y eliminados, b) Aplica todos los cambios en una única transacción, c) Garantiza que todos los cambios se realizan o ninguno (atomicidad), d) Optimiza la persistencia agrupando operaciones similares cuando es posible.',
    applicability: [
      'Operaciones de negocio que modifican múltiples entidades relacionadas',
      'Sistemas con requisitos de integridad transaccional estrictos',
      'Aplicaciones que utilizan ORM (Object-Relational Mapping)',
      'Escenarios donde es importante mantener la coherencia entre objetos en memoria y su representación persistente',
      'Cuando se necesita optimizar el rendimiento agrupando múltiples operaciones de base de datos'
    ],
    consequences: [
      'Garantiza la integridad y consistencia de los datos a través de múltiples operaciones',
      'Simplifica la lógica de negocio al centralizar la responsabilidad de persistencia',
      'Mejora el rendimiento al minimizar las operaciones de base de datos mediante agrupación',
      'Facilita la implementación de operaciones complejas que afectan a múltiples entidades',
      'Añade complejidad adicional en la capa de acceso a datos',
      'Puede ocultar problemas de rendimiento relacionados con transacciones de larga duración',
      'Requiere cuidadosa gestión de memoria para evitar fugas, especialmente con colecciones grandes de objetos rastreados'
    ]
  },
  notes: 'El patrón Unit of Work se utiliza ampliamente en frameworks ORM como Hibernate/JPA (Java), Entity Framework (C#), y Doctrine (PHP). Suele implementarse junto con el patrón Repository, donde los repositorios obtienen/recuperan objetos y el Unit of Work coordina los cambios realizados en esos objetos. Es importante establecer límites claros para las unidades de trabajo: demasiado grandes pueden causar problemas de rendimiento y bloqueos, mientras que demasiado pequeñas pueden fragmentar operaciones lógicamente relacionadas. En implementaciones avanzadas, se puede combinar con patrones como Identity Map para garantizar que no haya instancias duplicadas de las mismas entidades.'
};

export default unitOfWorkPattern; 