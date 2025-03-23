const serviceLocatorPattern = {
  id: 'service-locator',
  name: 'Service Locator',
  category: 'ioc',
  description: 'Un patrón de diseño que encapsula los procesos de obtener un servicio con una fuerte capa de abstracción.',
  theory: {
    background: 'El patrón Service Locator surgió como una alternativa a la Inyección de Dependencias, permitiendo a los componentes acceder a servicios sin acoplamientos directos a implementaciones concretas.',
    problem: 'Los componentes necesitan utilizar servicios sin depender directamente de implementaciones específicas, pero sin la complejidad adicional de inyección de dependencias.',
    solution: 'Crear un registro centralizado (localizador) donde los servicios pueden registrarse, y los clientes pueden solicitar servicios por un identificador, normalmente una interfaz o un nombre.',
    applicability: [
      'Sistemas donde inyectar dependencias a través de constructores resultaría en firmas muy extensas',
      'Aplicaciones donde los servicios cambian con frecuencia o se determinan en tiempo de ejecución',
      'Escenarios donde se necesita simplificar la configuración de sistemas complejos',
      'Cuando se requiere abstracción para los servicios pero con acceso global controlado'
    ],
    consequences: [
      'Reduce el acoplamiento entre componentes y sus dependencias concretas',
      'Facilita el cambio de implementaciones en tiempo de ejecución',
      'Simplifica las pruebas permitiendo sustituir servicios por mocks',
      'Puede ocultar dependencias, haciendo el código menos explícito en sus requisitos',
      'Introduce una dependencia global que puede dificultar la gestión'
    ]
  },
  notes: 'El Service Locator es a menudo contrastado con la Inyección de Dependencias. Mientras que la DI hace explícitas las dependencias a través de constructores o setters, el Service Locator las oculta detrás de una fachada. Esto puede hacer el código más limpio a simple vista, pero también más difícil de rastrear dependencias. El patrón es útil en aplicaciones con muchos servicios o cuando las dependencias varían en tiempo de ejecución, pero debe usarse con cautela para evitar crear un "antipatrón Singleton" globalizado. En la actualidad, la Inyección de Dependencias suele ser preferida para su uso en aplicaciones empresariales, mientras que el Service Locator encuentra sus casos de uso en frameworks y middleware donde la flexibilidad en tiempo de ejecución es crítica.'
};

export default serviceLocatorPattern; 