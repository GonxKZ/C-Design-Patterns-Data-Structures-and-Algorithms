const retryPattern = {
  id: 'retry',
  name: 'Retry',
  category: 'resilience',
  description: 'Maneja fallos temporales intentando repetir operaciones fallidas utilizando diversas estrategias de reintento.',
  theory: {
    background: 'El patrón Retry es una técnica de resiliencia básica que reconoce que muchos fallos en sistemas distribuidos son transitorios por naturaleza. Problemas como congestión de red, bloqueos temporales de bases de datos o picos de carga suelen resolverse automáticamente con el tiempo.',
    problem: 'En entornos distribuidos, las operaciones pueden fallar por razones transitorias que se resolverían simplemente reintentando la operación después de un breve período. Si no se manejan estos fallos, pueden propagarse al usuario final o a otros sistemas, degradando la experiencia o causando fallos en cascada.',
    solution: 'Implementar un mecanismo que detecte fallos específicos considerados transitorios y reintente automáticamente la operación fallida siguiendo una política predefinida. Estas políticas suelen incluir el número máximo de reintentos, el intervalo entre intentos, y estrategias de espaciado como retroceso exponencial y jitter (variación aleatoria).',
    applicability: [
      'Comunicaciones de red y llamadas a APIs externas',
      'Operaciones de entrada/salida como acceso a bases de datos o sistemas de archivos',
      'Cuando se interactúa con sistemas que experimentan contención de recursos',
      'Peticiones a servicios que implementan limitación de tasa (rate limiting)',
      'Transacciones distribuidas que pueden fallar por problemas de concurrencia'
    ],
    consequences: [
      'Mayor resiliencia ante fallos transitorios',
      'Mejora de la disponibilidad percibida por el usuario',
      'Reducción de errores que requieren intervención manual',
      'Incremento en latencia cuando ocurren fallos',
      'Riesgo de agravar problemas si los reintentos no se implementan correctamente (por ejemplo, sin retroceso exponencial)'
    ]
  },
  notes: 'El patrón Retry debe implementarse cuidadosamente, considerando siempre la idempotencia de las operaciones reintentadas. Las estrategias comunes incluyen reintentos inmediatos, reintentos con intervalos fijos, retroceso exponencial (aumentando progresivamente el tiempo entre reintentos) y jitter (añadiendo variación aleatoria para evitar tormentas de reintentos sincronizados). Es aconsejable combinar Retry con Circuit Breaker para evitar reintentos innecesarios cuando un servicio está completamente caído. Bibliotecas como Polly (.NET), Resilience4j (Java) y Axios Retry (JavaScript) proporcionan implementaciones robustas de este patrón.'
};

export default retryPattern; 