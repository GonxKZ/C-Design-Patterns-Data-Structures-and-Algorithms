const cacheAsidePattern = {
  id: 'cache-aside',
  name: 'Cache-Aside',
  category: 'data-access',
  description: 'Optimiza el acceso a datos cargando información bajo demanda en una caché y actualizándola de forma controlada para reducir la carga en el almacenamiento principal y mejorar el rendimiento de lectura.',
  theory: {
    background: 'El patrón Cache-Aside (también conocido como Lazy Loading) es una de las estrategias de caché más utilizadas en aplicaciones empresariales. A diferencia de otros patrones de caché como Read-Through o Write-Through, donde la caché gestiona directamente las interacciones con el almacenamiento, en Cache-Aside es la aplicación la que coordina estas interacciones.',
    problem: 'Los sistemas con alta carga de lecturas enfrentan varios desafíos: 1) Alto tiempo de respuesta cuando todas las lecturas van al almacenamiento principal, 2) Carga excesiva en la base de datos u otro almacenamiento persistente, 3) Costes elevados asociados a consultas frecuentes, 4) Necesidad de escalar horizontalmente para manejar el volumen de lecturas, lo que aumenta la complejidad y el coste.',
    solution: 'Implementar una caché separada que almacena datos de uso frecuente, con la aplicación gestionando las interacciones entre caché y almacenamiento. El patrón sigue este flujo: a) Cuando se solicitan datos, la aplicación intenta recuperarlos primero de la caché, b) Si los datos están en caché (hit), se devuelven inmediatamente, c) Si no están en caché (miss), la aplicación los recupera del almacenamiento principal, los almacena en la caché y luego los devuelve, d) Para actualizaciones, la aplicación actualiza el almacenamiento principal y luego invalida o actualiza la entrada correspondiente en la caché.',
    applicability: [
      'Sistemas con un ratio de lectura/escritura alto, donde los datos se leen frecuentemente pero se actualizan con menor frecuencia',
      'Aplicaciones donde el coste de generar o recuperar datos es significativo (en términos de tiempo o recursos)',
      'Cuando los datos cambian con frecuencia pero es aceptable que la aplicación ocasionalmente reciba datos ligeramente obsoletos',
      'Escenarios donde se necesita escalabilidad para operaciones de lectura',
      'Sistemas donde se puede tolerar la complejidad adicional de gestionar la coherencia de la caché'
    ],
    consequences: [
      'Reducción significativa de la latencia para datos frecuentemente accedidos',
      'Disminución de la carga en el almacenamiento principal',
      'Mayor escalabilidad del sistema para operaciones de lectura',
      'Posible inconsistencia temporal entre la caché y el almacenamiento principal',
      'Complejidad adicional en la lógica de la aplicación para gestionar la caché',
      'Necesidad de implementar estrategias de expiración o invalidación de caché',
      'Overhead de memoria para almacenar datos duplicados en la caché'
    ]
  },
  notes: 'Para implementar eficazmente Cache-Aside, es importante considerar: 1) Políticas de expiración para evitar datos obsoletos, 2) Estrategias de invalidación de caché para mantener la coherencia, 3) Mecanismos para prevenir la "avalancha de caché" (cuando múltiples solicitudes simultáneas intentan recargar un mismo dato ausente). Tecnologías comunes para implementar este patrón incluyen Redis, Memcached, Hazelcast, y las capacidades de caché incorporadas en muchos frameworks. En sistemas distribuidos, es común combinar Cache-Aside con patrones como Circuit Breaker para manejar fallos en el almacenamiento principal.'
};

export default cacheAsidePattern; 