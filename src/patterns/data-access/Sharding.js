const shardingPattern = {
  id: 'sharding',
  name: 'Sharding',
  category: 'data-access',
  description: 'Distribuye datos entre múltiples nodos o servidores de bases de datos, fragmentándolos horizontalmente según una clave de partición para mejorar la escalabilidad y el rendimiento.',
  theory: {
    background: 'El patrón Sharding es una técnica de particionamiento de bases de datos que se ha vuelto fundamental en sistemas de gran escala. Surgió como respuesta a las limitaciones de escalabilidad vertical (añadir más recursos a un único servidor) en aplicaciones con grandes volúmenes de datos.',
    problem: 'A medida que los datos crecen, un único servidor de base de datos se convierte en un cuello de botella debido a: 1) Limitaciones de almacenamiento físico, 2) Degradación del rendimiento de consultas a medida que las tablas crecen, 3) Contención de recursos cuando muchos clientes acceden simultáneamente, 4) Límites en la capacidad de escalar verticalmente.',
    solution: 'Particionar horizontalmente los datos en múltiples fragmentos (shards) que se distribuyen entre varios servidores. Cada fragmento contiene un subconjunto de los datos basado en una clave de partición (como ID de usuario, rango de fechas o ubicación geográfica). Las consultas se dirigen al fragmento específico que contiene los datos requeridos.',
    applicability: [
      'Bases de datos con grandes volúmenes de datos que superan la capacidad de un solo servidor',
      'Aplicaciones con alta concurrencia de lectura/escritura que necesitan distribuir la carga',
      'Sistemas que requieren alta disponibilidad y tolerancia a fallos',
      'Cuando la partición lógica de los datos se alinea con patrones de acceso específicos',
      'Datos que pueden dividirse naturalmente por geografía, cliente, tiempo u otra dimensión'
    ],
    consequences: [
      'Mayor escalabilidad horizontal para manejar grandes volúmenes de datos',
      'Mejor rendimiento al paralelizar consultas entre múltiples nodos',
      'Aislamiento de fallos que mejora la disponibilidad general del sistema',
      'Complejidad en operaciones que cruzan múltiples fragmentos (joins, transacciones)',
      'Desafíos en el balanceo de fragmentos y redistribución de datos',
      'Mayor complejidad operativa en la gestión de múltiples nodos de base de datos'
    ]
  },
  notes: 'Existen diferentes estrategias de sharding: 1) Por rango, donde los datos se dividen en rangos contiguos, 2) Por hash, que distribuye los datos uniformemente mediante una función hash, 3) Por directorio, que mantiene un mapeo explícito de qué datos van a qué shard. Muchas bases de datos modernas como MongoDB, Cassandra, y sistemas SQL distribuidos ofrecen capacidades de sharding incorporadas. Al implementar sharding, es importante considerar cuidadosamente la elección de la clave de partición para evitar hot spots (fragmentos sobrecargados) y minimizar operaciones entre fragmentos.'
};

export default shardingPattern; 