const throttlingPattern = {
  id: 'throttling',
  name: 'Throttling',
  category: 'resilience',
  description: 'Limita la tasa de ejecución de operaciones para proteger recursos y mantener la disponibilidad del sistema bajo carga.',
  theory: {
    background: 'El patrón Throttling es una técnica de control de flujo que limita el número de solicitudes que un componente puede procesar en un período de tiempo determinado. Es fundamental en sistemas distribuidos y APIs públicas para prevenir sobrecargas y garantizar una distribución justa de recursos.',
    problem: 'Sin límites en la frecuencia de solicitudes, un sistema puede sobrecargarse por: 1) Clientes mal configurados que envían demasiadas solicitudes, 2) Ataques de denegación de servicio, 3) Picos naturales de tráfico que superan la capacidad del sistema, lo que lleva a degradación de servicio para todos los usuarios.',
    solution: 'Implementar un mecanismo que monitorea y controla la tasa de solicitudes, limitándolas a un umbral predefinido. Cuando se excede este umbral, el sistema puede: a) Rechazar solicitudes adicionales (hard throttling), b) Poner en cola las solicitudes para procesamiento posterior (soft throttling), o c) Priorizar ciertas solicitudes sobre otras (adaptive throttling).',
    applicability: [
      'APIs públicas o servicios compartidos con múltiples consumidores',
      'Sistemas con recursos limitados que necesitan protección contra sobrecargas',
      'Servicios que requieren asignación justa de recursos entre clientes',
      'Cuando existe la necesidad de mantener SLAs (Acuerdos de Nivel de Servicio) específicos',
      'Para proteger dependencias críticas de sobrecarga'
    ],
    consequences: [
      'Mejor estabilidad del sistema bajo carga alta',
      'Distribución más equitativa de recursos entre clientes',
      'Protección contra ciertos tipos de ataques DoS',
      'Potencial rechazo de solicitudes legítimas durante períodos de alta demanda',
      'Necesidad de estrategias de comunicación claras para informar a los clientes sobre límites de tasa',
      'Complejidad adicional en la implementación de servicios'
    ]
  },
  notes: 'Existen múltiples algoritmos para implementar throttling, incluyendo Token Bucket, Leaky Bucket, Fixed Window Counter y Sliding Window Log. Cada enfoque tiene diferentes características en términos de precisión, complejidad y uso de memoria. En sistemas modernos, el throttling suele implementarse a nivel de API Gateway o mediante servicios especializados. Para clientes, es importante implementar estrategias de retry con backoff exponencial para manejar adecuadamente las respuestas de limitación de tasa (generalmente códigos HTTP 429 "Too Many Requests").'
};

export default throttlingPattern; 