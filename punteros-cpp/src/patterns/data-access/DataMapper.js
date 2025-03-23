const dataMapperPattern = {
  id: 'data-mapper',
  name: 'Data Mapper',
  category: 'data-access',
  description: 'Separa los objetos de dominio de la capa de persistencia mediante una capa de mapeo que transfiere los datos entre ellos, manteniendo la independencia entre ambos.',
  theory: {
    background: 'El patrón Data Mapper fue catalogado por Martin Fowler como parte de los patrones de arquitectura empresarial. Está diseñado para abordar el problema fundamental de desacoplar el modelo de dominio, que debe centrarse en la lógica de negocio, de los detalles específicos de la persistencia de datos, como esquemas de base de datos o formatos de almacenamiento.',
    problem: 'La integración directa de la lógica de persistencia en objetos de dominio genera varios problemas: 1) Acoplamiento entre el modelo de dominio y el esquema de datos, lo que dificulta evolucionar cada uno independientemente, 2) Contaminación del modelo de dominio con detalles de persistencia ajenos a la lógica de negocio, 3) Dificultad para probar los objetos de dominio de forma aislada, 4) Complejidad para cambiar el mecanismo de persistencia sin modificar el modelo, 5) Posibles compromisos en el diseño del dominio para acomodar restricciones de persistencia.',
    solution: 'Implementar una capa dedicada de componentes (mappers) responsables de transferir datos entre objetos de dominio y la capa de persistencia. Estos mappers: a) Conocen tanto la estructura del objeto de dominio como la del almacenamiento, b) Cargan datos desde la persistencia y los transforman en objetos de dominio, c) Extraen datos de los objetos de dominio para guardarlos en la persistencia, d) Gestionan las discrepancias entre el modelo de dominio y el modelo de datos, e) Mantienen los objetos de dominio completamente ignorantes de cómo se almacenan sus datos.',
    applicability: [
      'Sistemas con modelos de dominio complejos que deben mantenerse libres de preocupaciones de persistencia',
      'Aplicaciones donde el modelo de datos y el modelo de dominio difieren significativamente en estructura',
      'Escenarios que requieren flexibilidad para evolucionar independientemente el dominio y la persistencia',
      'Proyectos que necesitan soportar múltiples fuentes de datos o mecanismos de persistencia',
      'Cuando las pruebas unitarias del modelo de dominio son prioritarias y requieren aislamiento'
    ],
    consequences: [
      'Completa separación entre el dominio y la persistencia, permitiendo que cada uno evolucione independientemente',
      'Modelo de dominio más limpio, centrado únicamente en lógica de negocio',
      'Mayor facilidad para cambiar la estrategia de persistencia sin afectar al dominio',
      'Mejora significativa en la capacidad de prueba del modelo de dominio',
      'Abstracción más efectiva de detalles técnicos de persistencia',
      'Aumento de la complejidad inicial del sistema con una capa adicional',
      'Posible sobrecarga de rendimiento por la traducción entre capas'
    ]
  },
  notes: 'El patrón Data Mapper se utiliza en muchos frameworks ORM como Hibernate, Doctrine, y MyBatis. A diferencia del patrón Active Record, donde los objetos de dominio conocen cómo persistirse, en Data Mapper esta responsabilidad está completamente externalizada. Es especialmente valioso en proyectos de cierta complejidad donde el modelo de dominio debe evolucionar siguiendo principios de DDD (Domain-Driven Design) sin las restricciones impuestas por consideraciones de persistencia. Para mapeos complejos, es común utilizar técnicas como el patrón Assembler/Translator para convertir entre representaciones de datos o implementar estrategias de carga diferida (lazy loading) para mejorar el rendimiento.'
};

export default dataMapperPattern; 