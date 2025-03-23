const objectPoolPattern = {
  id: 'object-pool',
  name: 'Object Pool',
  category: 'creational',
  description: 'Administra un conjunto de objetos inicializados que pueden ser reutilizados, evitando la creación y destrucción constante cuando se necesitan temporalmente objetos costosos.',
  theory: {
    background: 'El patrón Object Pool surge de la necesidad de optimizar el rendimiento en escenarios donde la creación y destrucción de objetos es costosa, como en conexiones a bases de datos, hilos, o gráficos. En lugar de crear y destruir objetos continuamente, se mantiene un "pool" (piscina) de objetos reutilizables. Este patrón ha sido utilizado desde los primeros días de la programación orientada a objetos, especialmente en sistemas con recursos limitados o aplicaciones de alto rendimiento.',
    problem: 'La creación y destrucción frecuente de objetos costosos puede degradar significativamente el rendimiento de una aplicación, causando sobrecarga de CPU, fragmentación de memoria, y presión sobre el recolector de basura.',
    solution: 'Mantener un conjunto (pool) de objetos inicializados listos para usar. Cuando se necesita un objeto, se solicita al pool en lugar de crear uno nuevo. Cuando se termina de usar, el objeto se devuelve al pool en lugar de destruirlo, quedando disponible para futuras solicitudes. Si el pool está vacío cuando se solicita un objeto, se pueden crear instancias adicionales según políticas predefinidas.',
    applicability: [
      'Cuando los objetos son costosos de crear (conexiones de base de datos, conexiones de red, hilos, objetos gráficos grandes)',
      'Cuando se necesitan muchos objetos de vida corta',
      'Cuando el patrón de uso muestra picos de demanda de objetos',
      'Para limitar el número máximo de objetos que una aplicación puede crear',
      'Cuando el costo de inicialización de un objeto es mayor que el costo de reutilizarlo'
    ],
    consequences: [
      'Mejora significativa del rendimiento al evitar la creación y destrucción constante de objetos',
      'Reduce la presión sobre el recolector de basura o la gestión de memoria',
      'Controla el número máximo de objetos creados, ahorrando recursos',
      'Añade complejidad a la gestión del ciclo de vida de los objetos',
      'Riesgo de fugas de memoria si los objetos no se devuelven correctamente al pool',
      'Posibles problemas si los objetos mantienen estado entre usos que no se reinicia adecuadamente',
      'Puede llevar a un uso ineficiente de memoria si el pool es demasiado grande o los objetos rara vez se utilizan'
    ]
  }
};

export default objectPoolPattern; 