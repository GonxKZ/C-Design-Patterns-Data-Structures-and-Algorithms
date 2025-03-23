const timeoutPattern = {
  id: 'timeout',
  name: 'Timeout',
  category: 'resilience',
  description: 'Limita el tiempo que una operación puede tardar en completarse, cancelándola si excede el límite establecido para evitar bloqueos indefinidos.',
  theory: {
    background: 'El patrón Timeout es una técnica fundamental en sistemas distribuidos que establece límites de tiempo para operaciones potencialmente lentas o que pueden bloquearse. Es un componente esencial en la construcción de sistemas robustos y responsivos.',
    problem: 'En sistemas distribuidos, las operaciones pueden bloquearse indefinidamente debido a: 1) Fallos en servicios remotos, 2) Problemas de red, 3) Sobrecarga de recursos, o 4) Condiciones de carrera. Sin mecanismos de timeout, estos bloqueos pueden agotar recursos como hilos, conexiones o memoria, afectando negativamente a todo el sistema.',
    solution: 'Implementar un mecanismo que monitorea el tiempo transcurrido durante una operación y la cancela si excede un umbral predefinido. Este mecanismo puede ser implementado a diferentes niveles: a nivel de llamada, de servicio, o incluso a nivel de infraestructura.',
    applicability: [
      'Llamadas a servicios externos o APIs de terceros',
      'Operaciones de red que pueden verse afectadas por latencia',
      'Consultas a bases de datos que podrían bloquearse o tardar demasiado',
      'Operaciones de larga duración donde es preferible fallar rápido que esperar indefinidamente',
      'Comunicación entre microservicios donde la respuesta oportuna es crítica'
    ],
    consequences: [
      'Prevención de bloqueos indefinidos y agotamiento de recursos',
      'Mayor previsibilidad en el comportamiento del sistema bajo carga',
      'Capacidad para fallar rápidamente y aplicar estrategias alternativas',
      'Posible cancelación prematura de operaciones válidas que simplemente son lentas',
      'Necesidad de manejar adecuadamente los errores de timeout en el código cliente',
      'Complejidad adicional al determinar valores apropiados de timeout para diferentes operaciones'
    ]
  },
  notes: 'Es crucial elegir valores de timeout apropiados: demasiado cortos pueden causar fallos innecesarios, mientras que demasiado largos pueden no proteger adecuadamente el sistema. Los timeouts adaptativos que ajustan dinámicamente sus valores basados en condiciones del sistema o histórico de operaciones pueden ser más efectivos que valores estáticos. El patrón Timeout suele combinarse con Circuit Breaker y Retry para crear estrategias de resiliencia más robustas. En sistemas complejos, es recomendable implementar timeouts a múltiples niveles (por ejemplo, tanto en el cliente como en el servidor) para mayor seguridad.'
};

export default timeoutPattern; 