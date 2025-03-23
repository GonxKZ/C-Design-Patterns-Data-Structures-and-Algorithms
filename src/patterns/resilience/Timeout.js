const timeoutPattern = {
  id: 'timeout',
  name: 'Timeout',
  category: 'resilience',
  description: 'Limita el tiempo que una operación puede tardar en completarse, cancelándola si excede el límite establecido para evitar bloqueos indefinidos.',
  
  implementations: {
    javascript: {
      code: `/**
 * Implementación del patrón Timeout para operaciones asíncronas en JavaScript
 * @param {Promise} operation - La operación que queremos limitar en tiempo
 * @param {number} timeoutMs - Tiempo máximo en milisegundos
 * @param {string} errorMessage - Mensaje opcional para el error de timeout
 * @returns {Promise} - Promise que se resolverá con el resultado o rechazará con error de timeout
 */
function withTimeout(operation, timeoutMs, errorMessage = 'Operation timed out') {
  // Creamos una promesa que se rechaza después del tiempo especificado
  const timeoutPromise = new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  // Usamos Promise.race para competir entre la operación original y el timeout
  return Promise.race([operation, timeoutPromise]);
}

// Ejemplo 1: Timeout simple en una llamada fetch
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  return withTimeout(
    fetch(url, options).then(response => {
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return response.json();
    }),
    timeoutMs,
    \`Fetch a \${url} excedió el tiempo límite de \${timeoutMs}ms\`
  );
}

// Ejemplo 2: Timeout con cancelación de la operación subyacente
function fetchWithAbortTimeout(url, options = {}, timeoutMs = 5000) {
  // Creamos un controlador de cancelación
  const controller = new AbortController();
  const { signal } = controller;
  
  // Añadimos la señal a las opciones de fetch
  const fetchOptions = { ...options, signal };
  
  // Configuramos el timeout que abortará la operación
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  // Ejecutamos el fetch con la señal de cancelación
  return fetch(url, fetchOptions)
    .then(response => {
      clearTimeout(timeoutId); // Limpiamos el timeout si la operación tiene éxito
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return response.json();
    })
    .catch(error => {
      clearTimeout(timeoutId); // Limpiamos el timeout en caso de error
      
      // Distinguimos entre error de timeout y otros errores
      if (error.name === 'AbortError') {
        throw new Error(\`Fetch a \${url} fue abortado después de \${timeoutMs}ms\`);
      }
      throw error;
    });
}

// Ejemplo 3: Timeout para funciones de callback
function callbackWithTimeout(callback, timeoutMs = 5000) {
  let timeoutId;
  let completed = false;
  
  // Función que será llamada cuando el callback se complete
  const onComplete = (...args) => {
    if (completed) return;
    completed = true;
    clearTimeout(timeoutId);
    callback(...args);
  };
  
  // Configuramos el timeout
  timeoutId = setTimeout(() => {
    if (!completed) {
      completed = true;
      callback(new Error(\`Operación excedió el límite de \${timeoutMs}ms\`));
    }
  }, timeoutMs);
  
  // Devolvemos una función wrapper que registra la finalización
  return (...args) => {
    onComplete(null, ...args);
  };
}`,
      explanation: [
        { line: 1, text: 'Función que implementa el patrón Timeout para operaciones asíncronas.' },
        { line: 8, text: 'Creamos una promesa que se rechaza cuando se alcanza el timeout.' },
        { line: 15, text: 'Usamos Promise.race() para competir entre la operación y el timeout.' },
        { line: 19, text: 'Ejemplo 1: Aplicación del timeout a una petición fetch.' },
        { line: 30, text: 'Ejemplo 2: Timeout con cancelación de la operación subyacente.' },
        { line: 33, text: 'Usamos AbortController para poder cancelar la petición fetch.' },
        { line: 38, text: 'Configuramos un timeout que cancelará la operación al dispararse.' },
        { line: 43, text: 'Limpiamos el timeout si la operación termina antes (éxito o error).' },
        { line: 55, text: 'Distinguimos entre errores de timeout (AbortError) y otros errores.' },
        { line: 61, text: 'Ejemplo 3: Timeout para funciones que usan callbacks.' },
        { line: 64, text: 'Función que será llamada cuando el callback se complete.' },
        { line: 72, text: 'Configuramos el timeout que llamará al callback con un error.' },
        { line: 80, text: 'Wrapper que registra la finalización exitosa.' }
      ]
    },
    java: {
      code: `import java.util.concurrent.*;
import java.util.function.Supplier;

/**
 * Implementaciones del patrón Timeout en Java
 */
public class TimeoutPattern {

    /**
     * Ejecuta una tarea con timeout usando Future
     * @param callable La tarea a ejecutar
     * @param timeout Tiempo máximo de espera
     * @param timeUnit Unidad de tiempo
     * @return El resultado de la tarea
     * @throws TimeoutException Si la tarea excede el tiempo límite
     * @throws Exception Si la tarea falla por otra razón
     */
    public static <T> T executeWithTimeout(Callable<T> callable, long timeout, TimeUnit timeUnit) 
            throws TimeoutException, Exception {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<T> future = null;
        try {
            future = executor.submit(callable);
            return future.get(timeout, timeUnit);
        } finally {
            if (future != null) {
                future.cancel(true); // Intentar cancelar la tarea si aún está en ejecución
            }
            executor.shutdownNow(); // Cerrar el executor
        }
    }
    
    /**
     * Ejecuta una tarea con timeout usando CompletableFuture
     * @param supplier La tarea a ejecutar
     * @param timeout Tiempo máximo de espera
     * @param timeUnit Unidad de tiempo
     * @return El resultado de la tarea
     * @throws TimeoutException Si la tarea excede el tiempo límite
     * @throws Exception Si la tarea falla por otra razón
     */
    public static <T> T executeWithCompletableFuture(Supplier<T> supplier, long timeout, TimeUnit timeUnit) 
            throws TimeoutException, Exception {
        CompletableFuture<T> future = CompletableFuture.supplyAsync(supplier);
        try {
            return future.get(timeout, timeUnit);
        } catch (ExecutionException e) {
            // Extraer la causa real de la ExecutionException
            Throwable cause = e.getCause();
            if (cause instanceof Exception) {
                throw (Exception) cause;
            }
            throw new RuntimeException(cause);
        } finally {
            future.cancel(true); // Intentar cancelar la tarea
        }
    }
    
    /**
     * Versión mejorada que permite configurar un executor y gestionar mejor la cancelación
     */
    public static <T> T executeWithConfigurableTimeout(
            Supplier<T> supplier, 
            long timeout, 
            TimeUnit timeUnit,
            Executor executor,
            boolean mayInterruptIfRunning) throws Exception {
        
        // Crear un CompletableFuture para la tarea
        CompletableFuture<T> taskFuture = CompletableFuture.supplyAsync(supplier, executor);
        
        // Crear un CompletableFuture para el timeout
        CompletableFuture<T> timeoutFuture = failAfter(timeout, timeUnit);
        
        try {
            // Competir entre la tarea y el timeout
            return CompletableFuture.anyOf(taskFuture, timeoutFuture)
                    .thenApply(result -> (T) result)
                    .get();
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof TimeoutException) {
                // Cancelar la tarea original si se produjo timeout
                taskFuture.cancel(mayInterruptIfRunning);
                throw (TimeoutException) cause;
            } else if (cause instanceof Exception) {
                throw (Exception) cause;
            }
            throw new RuntimeException(cause);
        }
    }
    
    // Crea un CompletableFuture que falla después del tiempo especificado
    private static <T> CompletableFuture<T> failAfter(long timeout, TimeUnit timeUnit) {
        CompletableFuture<T> future = new CompletableFuture<>();
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        
        scheduler.schedule(() -> {
            future.completeExceptionally(new TimeoutException("Operation timed out"));
            scheduler.shutdown();
        }, timeout, timeUnit);
        
        return future;
    }
    
    /**
     * Ejemplo de uso
     */
    public static void main(String[] args) {
        try {
            // Ejemplo 1: Tarea que termina antes del timeout
            String result1 = executeWithTimeout(
                () -> {
                    Thread.sleep(500); // Simular trabajo
                    return "Operación completada con éxito";
                }, 
                1000, // 1 segundo
                TimeUnit.MILLISECONDS
            );
            System.out.println("Resultado 1: " + result1);
            
            // Ejemplo 2: Tarea que excede el timeout
            String result2 = executeWithTimeout(
                () -> {
                    Thread.sleep(2000); // Simular trabajo lento
                    return "Esta línea nunca se ejecutará";
                }, 
                1000, // 1 segundo
                TimeUnit.MILLISECONDS
            );
            System.out.println("Resultado 2: " + result2); // No se ejecutará
            
        } catch (TimeoutException e) {
            System.err.println("Error de timeout: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error general: " + e.getMessage());
        }
    }
}`,
      explanation: [
        { line: 1, text: 'Importación de clases necesarias para concurrencia y timeout.' },
        { line: 8, text: 'Primer método: implementación de timeout usando Future.' },
        { line: 16, text: 'Creamos un executor para ejecutar la tarea en un hilo separado.' },
        { line: 19, text: 'Usamos future.get() con timeout para limitar el tiempo de espera.' },
        { line: 22, text: 'Cancelamos la tarea si aún está en ejecución cuando salimos.' },
        { line: 31, text: 'Segundo método: implementación usando CompletableFuture.' },
        { line: 38, text: 'Creamos y ejecutamos la tarea de forma asíncrona.' },
        { line: 40, text: 'Esperamos el resultado con un tiempo límite.' },
        { line: 42, text: 'Gestionamos la excepción para extraer la causa real del error.' },
        { line: 56, text: 'Método avanzado con configuración personalizada.' },
        { line: 64, text: 'Creamos un CompletableFuture para la tarea principal.' },
        { line: 67, text: 'Creamos un CompletableFuture que fallará después del timeout.' },
        { line: 71, text: 'Usamos anyOf para competir entre la tarea y el timeout.' },
        { line: 76, text: 'Si se produce timeout, cancelamos explícitamente la tarea original.' },
        { line: 88, text: 'Método auxiliar que crea un future que falla después del tiempo especificado.' },
        { line: 97, text: 'Ejemplos de uso con tareas que terminan antes o después del timeout.' }
      ]
    }
  },
  
  theory: {
    background: 'El patrón Timeout es una técnica fundamental en sistemas distribuidos que establece límites de tiempo para operaciones potencialmente lentas o que pueden bloquearse. Es un componente esencial en la construcción de sistemas robustos y responsivos. Su implementación se remonta a los primeros sistemas operativos y redes donde la necesidad de protegerse contra operaciones bloqueantes era crucial para mantener la disponibilidad y respuesta del sistema.',
    
    problem: 'En sistemas distribuidos, las operaciones pueden bloquearse indefinidamente debido a: 1) Fallos en servicios remotos, 2) Problemas de red, 3) Sobrecarga de recursos, o 4) Condiciones de carrera. Sin mecanismos de timeout, estos bloqueos pueden agotar recursos como hilos, conexiones o memoria, afectando negativamente a todo el sistema. Además, los usuarios experimentan tiempos de respuesta inaceptables o, peor aún, aplicaciones completamente bloqueadas. La propagación de estos bloqueos puede causar un efecto dominó, degradando progresivamente la disponibilidad de servicios interconectados.',
    
    solution: 'Implementar un mecanismo que monitorea el tiempo transcurrido durante una operación y la cancela si excede un umbral predefinido. Este mecanismo puede ser implementado a diferentes niveles: a nivel de llamada, de servicio, o incluso a nivel de infraestructura. La solución generalmente incluye: 1) Definir valores de timeout apropiados basados en las características y requisitos de la operación, 2) Monitorear el tiempo transcurrido, 3) Cancelar o interrumpir la operación si excede el límite, 4) Reportar el timeout como un tipo específico de error, y 5) Aplicar estrategias de manejo apropiadas como reintentos, fallbacks o degradación graceful.',
    
    applicability: [
      'Llamadas a servicios externos o APIs de terceros',
      'Operaciones de red que pueden verse afectadas por latencia',
      'Consultas a bases de datos que podrían bloquearse o tardar demasiado',
      'Operaciones de larga duración donde es preferible fallar rápido que esperar indefinidamente',
      'Comunicación entre microservicios donde la respuesta oportuna es crítica',
      'Operaciones con usuarios esperando respuestas interactivas',
      'Sistemas que manejan picos de carga y necesitan mantener tiempos de respuesta consistentes',
      'Aplicaciones que se ejecutan en entornos con recursos limitados o compartidos',
      'Sistemas críticos donde la disponibilidad y el tiempo de respuesta son requisitos fundamentales',
      'Operaciones que bloquean recursos valiosos como conexiones de bases de datos o hilos de trabajo'
    ],
    
    consequences: [
      'Prevención de bloqueos indefinidos y agotamiento de recursos',
      'Mayor previsibilidad en el comportamiento del sistema bajo carga',
      'Capacidad para fallar rápidamente y aplicar estrategias alternativas',
      'Posible cancelación prematura de operaciones válidas que simplemente son lentas',
      'Necesidad de manejar adecuadamente los errores de timeout en el código cliente',
      'Complejidad adicional al determinar valores apropiados de timeout para diferentes operaciones',
      'Potencial para cascadas de fallos si no se combina con otros patrones como Circuit Breaker',
      'Mayor complejidad del código por la necesidad de gestionar excepciones de timeout',
      'Posible degradación de la experiencia de usuario si no se implementan alternativas adecuadas',
      'Dificultad para distinguir entre operaciones realmente bloqueadas y aquellas que simplemente son lentas'
    ]
  },
  
  notes: `
    <h3>¿Cuándo DEBES usar el patrón Timeout?</h3>
    <ul>
      <li><strong>Siempre en comunicaciones de red:</strong> Toda comunicación a través de la red debe tener timeout, sin excepciones. La red es inherentemente no confiable.</li>
      <li><strong>Operaciones críticas para el flujo:</strong> Cuando una operación es parte de un flujo crítico que no puede permitirse esperar indefinidamente.</li>
      <li><strong>Recursos compartidos limitados:</strong> Para operaciones que utilizan recursos escasos como conexiones de bases de datos, hilos, memoria o descriptores de archivos.</li>
      <li><strong>APIs externas no controladas:</strong> Al interactuar con servicios externos donde no tienes control sobre su disponibilidad o tiempos de respuesta.</li>
      <li><strong>Interfaces de usuario interactivas:</strong> Para mantener la responsividad cuando los usuarios están esperando respuestas.</li>
      <li><strong>Sistemas de alta disponibilidad:</strong> Para garantizar que un componente lento no degrade todo el sistema.</li>
    </ul>
    
    <h3>Niveles de implementación del patrón Timeout:</h3>
    <ul>
      <li><strong>Nivel de llamada:</strong> El más común, donde cada llamada individual a un servicio o recurso tiene su propio timeout.</li>
      <li><strong>Nivel de servicio:</strong> Donde un conjunto de operaciones relacionadas comparten un timeout global, útil para flujos de trabajo completos.</li>
      <li><strong>Nivel de infraestructura:</strong> Implementado en proxies, gateways o balanceadores que limitan el tiempo total de las solicitudes.</li>
      <li><strong>Timeout anidado:</strong> Donde diferentes capas tienen sus propios timeouts, con valores crecientes a medida que se sube en la pila de llamadas.</li>
      <li><strong>Timeout diferenciado:</strong> Valores de timeout distintos según el tipo de operación, su prioridad o el cliente que la realiza.</li>
      <li><strong>Timeout adaptativo:</strong> Valores que se ajustan automáticamente basándose en métricas históricas o condiciones del sistema.</li>
    </ul>
    
    <h3>Estrategias para determinar valores de timeout apropiados:</h3>
    <ul>
      <li><strong>Análisis de percentiles:</strong> Utilizar el percentil 95 o 99 de los tiempos de respuesta históricos como base.</li>
      <li><strong>Pruebas de carga:</strong> Determinar tiempos óptimos mediante pruebas sistemáticas con diferentes cargas.</li>
      <li><strong>SLAs escalados:</strong> Establecer timeouts basados en los SLAs de nivel de servicio más un margen de seguridad.</li>
      <li><strong>Timeouts en cascada:</strong> Para llamadas anidadas, cada nivel debe tener un timeout menor que su padre.</li>
      <li><strong>Adaptación dinámica:</strong> Ajustar timeouts basándose en la carga actual del sistema y condiciones de red.</li>
      <li><strong>Contexto de operación:</strong> Variar timeouts según la criticidad, visibilidad o prioridad de la operación.</li>
    </ul>
    
    <h3>Mejores prácticas para implementar Timeout:</h3>
    <pre>
// Ejemplo de timeout adaptativo basado en métricas históricas
class AdaptiveTimeout {
  constructor(options = {}) {
    this.baseTimeoutMs = options.baseTimeoutMs || 1000;
    this.maxTimeoutMs = options.maxTimeoutMs || 10000;
    this.minTimeoutMs = options.minTimeoutMs || 100;
    this.percentileFactor = options.percentileFactor || 1.5; // Multiplicador sobre el p95
    
    // Ventana deslizante para almacenar tiempos de respuesta recientes
    this.responseTimesWindow = [];
    this.windowSize = options.windowSize || 100;
    this.currentSystemLoad = 0; // 0-1, representando carga del sistema
  }
  
  // Registra un tiempo de respuesta exitoso
  recordResponseTime(operationId, timeMs) {
    this.responseTimesWindow.push({
      operationId,
      timeMs,
      timestamp: Date.now()
    });
    
    // Mantener el tamaño de la ventana
    if (this.responseTimesWindow.length > this.windowSize) {
      this.responseTimesWindow.shift();
    }
  }
  
  // Actualiza la carga estimada del sistema (llamar periódicamente)
  updateSystemLoad(loadFactor) {
    this.currentSystemLoad = Math.max(0, Math.min(1, loadFactor));
  }
  
  // Calcula el timeout para una operación específica
  calculateTimeout(operationId) {
    // Obtener tiempos solo para esta operación
    const opTimes = this.responseTimesWindow
      .filter(entry => entry.operationId === operationId)
      .map(entry => entry.timeMs);
    
    if (opTimes.length < 10) {
      // No tenemos suficientes datos, usar timeout base
      return this.adjustForSystemLoad(this.baseTimeoutMs);
    }
    
    // Calcular el percentil 95
    const sortedTimes = [...opTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p95Time = sortedTimes[p95Index];
    
    // Calcular timeout basado en el p95 con un factor de seguridad
    let calculatedTimeout = p95Time * this.percentileFactor;
    
    // Asegurar que está dentro de los límites
    calculatedTimeout = Math.max(this.minTimeoutMs, 
                        Math.min(this.maxTimeoutMs, calculatedTimeout));
    
    // Ajustar según la carga del sistema
    return this.adjustForSystemLoad(calculatedTimeout);
  }
  
  // Ajustar timeout según la carga del sistema
  adjustForSystemLoad(timeoutMs) {
    // Bajo carga alta, aumentamos el timeout para reducir falsos positivos
    // Bajo carga baja, podemos ser más estrictos
    const loadFactor = 1 + (this.currentSystemLoad * 0.5); // 1-1.5x
    return Math.min(this.maxTimeoutMs, timeoutMs * loadFactor);
  }
  
  // Ejecutar una operación con timeout adaptativo
  async executeWithTimeout(operationId, operation) {
    const timeoutMs = this.calculateTimeout(operationId);
    const startTime = Date.now();
    
    try {
      // Crear promesa con timeout
      const result = await Promise.race([
        operation(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(\`Timeout after \${timeoutMs}ms\`)), timeoutMs)
        )
      ]);
      
      // Registrar tiempo de respuesta exitoso
      const elapsedTime = Date.now() - startTime;
      this.recordResponseTime(operationId, elapsedTime);
      
      return result;
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      
      // Si no fue timeout, también registramos el tiempo
      if (!error.message.includes('Timeout after')) {
        this.recordResponseTime(operationId, elapsedTime);
      }
      
      throw error;
    }
  }
}

// Uso:
const timeoutManager = new AdaptiveTimeout({
  baseTimeoutMs: 2000,
  maxTimeoutMs: 8000
});

// Periódicamente actualizar la carga del sistema
setInterval(() => {
  // En un sistema real, esto vendría de métricas del sistema
  const currentLoadFactor = getCurrentSystemLoad();
  timeoutManager.updateSystemLoad(currentLoadFactor);
}, 10000);

// Ejecutar operaciones con timeout adaptativo
async function fetchUserData(userId) {
  return timeoutManager.executeWithTimeout(
    \`fetch-user-\${userId}\`, 
    async () => {
      const response = await fetch(\`https://api.example.com/users/\${userId}\`);
      if (!response.ok) throw new Error(\`HTTP error \${response.status}\`);
      return response.json();
    }
  );
}
    </pre>
    
    <h3>Implementación de Timeout en diferentes entornos:</h3>
    <ul>
      <li><strong>HTTP/RESTful APIs:</strong> Configurar timeouts a nivel de cliente HTTP, respetando los valores recomendados del servicio si están documentados.</li>
      <li><strong>bases de datos:</strong> Configurar timeouts a nivel de consulta o comando SQL, considerando la complejidad y carga típica.</li>
      <li><strong>Microservicios:</strong> Implementar timeouts en el cliente y balanceador/gateway, con valores mayores en niveles superiores.</li>
      <li><strong>Colas de mensajes:</strong> Aplicar timeouts para la publicación, consumo y procesamiento de mensajes.</li>
      <li><strong>Procesamiento en lotes:</strong> Utilizar timeouts por lote e individuales por registro para operaciones masivas.</li>
    </ul>
    
    <h3>Timeout vs otros patrones de resiliencia:</h3>
    <ul>
      <li><strong>Timeout vs Circuit Breaker:</strong> Timeout protege contra operaciones individuales lentas, mientras que Circuit Breaker previene llamadas a servicios ya identificados como fallidos. Se complementan: Timeout detecta fallos, Circuit Breaker evita repetirlos.</li>
      <li><strong>Timeout vs Retry:</strong> Timeout define cuándo una operación falla por tiempo, mientras que Retry decide si intentarla nuevamente. Suelen usarse juntos: timeout → error → retry.</li>
      <li><strong>Timeout vs Bulkhead:</strong> Timeout limita el tiempo de una operación, mientras que Bulkhead limita los recursos que puede consumir. Bulkhead puede evitar que los timeouts agoten todos los recursos disponibles.</li>
      <li><strong>Timeout vs Fallback:</strong> Timeout detecta cuando fallar, Fallback proporciona una alternativa cuando ocurre el fallo. Combinación común: timeout → fallback.</li>
      <li><strong>Timeout vs Throttling:</strong> Timeout cancela operaciones demasiado lentas, Throttling limita cuántas operaciones pueden iniciarse. Throttling puede prevenir situaciones que llevarían a timeouts por sobrecarga.</li>
    </ul>
    
    <h3>Consideraciones específicas:</h3>
    <ul>
      <li><strong>Cancelación efectiva:</strong> Asegúrate de que el timeout realmente cancele la operación subyacente para liberar recursos, no solo devolver un error mientras la operación continúa ejecutándose.</li>
      <li><strong>Timeout versus calidad de servicio:</strong> Balancea la necesidad de prevenir bloqueos con mantener una buena experiencia de usuario; considera alternativas como respuestas parciales o progresivas.</li>
      <li><strong>Monitoreo y alertas:</strong> Implementa un seguimiento detallado de los timeouts para identificar patrones y ajustar configuraciones.</li>
      <li><strong>Manejadores de excepciones consistentes:</strong> Define claramente cómo manejar los errores de timeout en todo el sistema.</li>
      <li><strong>Estrategias de degradación:</strong> Establece métodos para degradar funcionalidad gracefully cuando ocurren timeouts, en lugar de fallar completamente.</li>
      <li><strong>Timeout en operaciones idempotentes vs no idempotentes:</strong> Sé especialmente cuidadoso con los timeouts en operaciones no idempotentes, donde un retry podría causar efectos secundarios duplicados.</li>
      <li><strong>Documentación para clientes:</strong> Documenta claramente los valores de timeout para que los clientes puedan implementar estrategias adecuadas.</li>
    </ul>
  `
};

export default timeoutPattern; 