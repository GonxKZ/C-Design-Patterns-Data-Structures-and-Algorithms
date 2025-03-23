const retryPattern = {
  id: 'retry',
  name: 'Retry',
  category: 'resilience',
  description: 'Maneja fallos temporales intentando repetir operaciones fallidas utilizando diversas estrategias de reintento.',
  
  implementations: {
    javascript: {
      code: `/**
 * Implementación simple del patrón Retry con retroceso exponencial y jitter
 * @param {Function} operation - Función que ejecuta la operación que puede fallar
 * @param {Object} options - Opciones de configuración
 * @returns {Promise} - Resultado de la operación
 */
async function retryWithExponentialBackoff(operation, options = {}) {
  const maxRetries = options.maxRetries || 3;
  const baseDelay = options.baseDelay || 1000; // 1 segundo
  const maxDelay = options.maxDelay || 30000; // 30 segundos
  const jitterFactor = options.jitterFactor || 0.2; // 20% de variación aleatoria
  const retryableErrors = options.retryableErrors || [
    'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'NETWORK_ERROR', 
    'RATE_LIMITED', 'INTERNAL_SERVER_ERROR', 'SERVICE_UNAVAILABLE'
  ];

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      // Almacenar el error para reutilizarlo si fallamos en el último intento
      lastError = error;
      
      // Comprobar si hemos agotado los reintentos
      const isLastAttempt = attempt >= maxRetries;
      if (isLastAttempt) {
        break;
      }
      
      // Comprobar si el error es retryable
      const errorCode = error.code || error.name || error.status;
      const isRetryable = retryableErrors.some(code => 
        (typeof code === 'string' && errorCode?.includes(code)) ||
        (code instanceof RegExp && code.test(errorCode)) ||
        (typeof code === 'number' && error.status === code)
      );
      
      if (!isRetryable) {
        throw error; // No reintentamos errores no retryables
      }
      
      // Calcular el retraso con retroceso exponencial
      const exponentialDelay = Math.min(
        maxDelay,
        baseDelay * Math.pow(2, attempt)
      );
      
      // Añadir jitter (variación aleatoria)
      const jitter = exponentialDelay * jitterFactor * (Math.random() * 2 - 1);
      const delay = Math.max(0, exponentialDelay + jitter);
      
      console.log(
        \`Reintento #\${attempt + 1} después de \${Math.round(delay)}ms. Error: \${error.message}\`
      );
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Si llegamos aquí, hemos agotado todos los reintentos
  throw lastError;
}

// Ejemplo de uso
async function fetchUserData(userId) {
  return retryWithExponentialBackoff(
    async () => {
      const response = await fetch(\`https://api.example.com/users/\${userId}\`);
      
      if (!response.ok) {
        const error = new Error(\`HTTP error \${response.status}\`);
        error.status = response.status;
        throw error;
      }
      
      return response.json();
    },
    {
      maxRetries: 5,
      baseDelay: 500,
      retryableErrors: [
        'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED',
        429, 500, 502, 503, 504 // Códigos HTTP retryables
      ]
    }
  );
}`,
      explanation: [
        { line: 1, text: 'Definición de la función principal que implementa el patrón Retry con retroceso exponencial y jitter.' },
        { line: 3, text: 'Recibe la operación a reintentar y opciones de configuración.' },
        { line: 7, text: 'Configuración de parámetros con valores por defecto para facilitar el uso.' },
        { line: 10, text: 'Lista de códigos de error que se consideran transitorios y por tanto retryables.' },
        { line: 16, text: 'Bucle principal que ejecuta la operación y maneja los reintentos.' },
        { line: 18, text: 'Intenta ejecutar la operación y retorna inmediatamente si tiene éxito.' },
        { line: 25, text: 'Comprueba si hemos llegado al último intento permitido.' },
        { line: 30, text: 'Determina si el error es de un tipo que debería ser reintentado.' },
        { line: 38, text: 'Si el error no es retryable, lo propaga inmediatamente sin más reintentos.' },
        { line: 42, text: 'Calcula el retraso usando retroceso exponencial (2^attempt) con un límite máximo.' },
        { line: 47, text: 'Añade jitter (variación aleatoria) para evitar sincronización entre clientes.' },
        { line: 54, text: 'Espera el tiempo calculado antes de intentar de nuevo.' },
        { line: 61, text: 'Si se agotan todos los reintentos, propaga el último error recibido.' },
        { line: 65, text: 'Ejemplo de uso del mecanismo de retry en una función que obtiene datos de usuario.' },
        { line: 67, text: 'La función de retry recibe una operación asíncrona que realiza la petición HTTP.' },
        { line: 70, text: 'Comprueba si la respuesta HTTP es exitosa, de lo contrario lanza un error.' },
        { line: 80, text: 'Configura los parámetros específicos para este caso de uso.' }
      ]
    },
    java: {
      code: `import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

/**
 * Implementación del patrón Retry con retroceso exponencial y jitter
 */
public class RetryUtil {
    // Excepciones que se consideran transitorias
    private static final List<Class<? extends Exception>> RETRYABLE_EXCEPTIONS = Arrays.asList(
            java.net.ConnectException.class,
            java.net.SocketTimeoutException.class,
            java.io.IOException.class,
            java.sql.SQLTransientException.class,
            java.util.concurrent.TimeoutException.class
    );

    /**
     * Ejecuta una operación con política de reintentos
     * @param operation La operación a ejecutar
     * @param maxRetries Número máximo de reintentos
     * @param initialDelayMs Retraso inicial entre reintentos (ms)
     * @param maxDelayMs Retraso máximo entre reintentos (ms)
     * @param <T> Tipo de retorno de la operación
     * @return El resultado de la operación
     * @throws Exception Si la operación falla después de agotar los reintentos
     */
    public static <T> T executeWithRetry(
            Supplier<T> operation,
            int maxRetries,
            long initialDelayMs,
            long maxDelayMs) throws Exception {
        
        int attempts = 0;
        Exception lastException = null;
        
        while (attempts <= maxRetries) {
            try {
                return operation.get();
            } catch (Exception e) {
                lastException = e;
                
                // Verificar si la excepción es retryable
                boolean isRetryable = RETRYABLE_EXCEPTIONS.stream()
                    .anyMatch(exClass -> exClass.isInstance(e));
                
                if (!isRetryable) {
                    throw e; // No reintentamos excepciones no transitorias
                }
                
                // Si este fue el último intento, propagar la excepción
                if (attempts >= maxRetries) {
                    break;
                }
                
                // Calcular el retraso con backoff exponencial
                long delayMs = Math.min(
                    maxDelayMs,
                    initialDelayMs * (long) Math.pow(2, attempts)
                );
                
                // Añadir jitter (±20%)
                float jitterFactor = 0.2f;
                long jitterMs = (long) (delayMs * jitterFactor * (ThreadLocalRandom.current().nextFloat() * 2 - 1));
                delayMs = Math.max(0, delayMs + jitterMs);
                
                System.out.printf("Reintento #%d después de %d ms. Error: %s%n", 
                                 attempts + 1, delayMs, e.getMessage());
                
                // Esperar antes del siguiente intento
                try {
                    TimeUnit.MILLISECONDS.sleep(delayMs);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Interrupción durante el retraso de reintento", ie);
                }
                
                attempts++;
            }
        }
        
        // Si llegamos aquí, hemos agotado todos los reintentos
        throw new Exception("Operación fallida después de " + maxRetries + " reintentos", lastException);
    }
    
    // Sobrecarga con valores predeterminados
    public static <T> T executeWithRetry(Supplier<T> operation) throws Exception {
        return executeWithRetry(operation, 3, 1000, 30000);
    }
    
    // Ejemplo de uso
    public static void main(String[] args) {
        try {
            String result = executeWithRetry(() -> {
                // Simulamos una operación que falla temporalmente
                if (Math.random() < 0.7) { // 70% de probabilidad de fallo
                    throw new java.net.SocketTimeoutException("Tiempo de espera agotado");
                }
                return "Operación exitosa";
            }, 5, 500, 10000);
            
            System.out.println("Resultado: " + result);
        } catch (Exception e) {
            System.err.println("Error final: " + e.getMessage());
        }
    }
}`,
      explanation: [
        { line: 1, text: 'Importaciones necesarias para la implementación.' },
        { line: 7, text: 'Clase principal que implementa el patrón Retry.' },
        { line: 9, text: 'Lista de tipos de excepciones que se consideran transitorias y por tanto retryables.' },
        { line: 19, text: 'Método principal que ejecuta una operación con política de reintentos.' },
        { line: 26, text: 'Recibe la operación a ejecutar y parámetros de configuración.' },
        { line: 33, text: 'Bucle principal que ejecuta la operación y maneja los reintentos.' },
        { line: 35, text: 'Intenta ejecutar la operación y retorna si es exitosa.' },
        { line: 40, text: 'Verifica si la excepción es de un tipo que debería ser reintentado.' },
        { line: 44, text: 'Si la excepción no es retryable, la propaga inmediatamente.' },
        { line: 48, text: 'Comprueba si se ha alcanzado el número máximo de reintentos.' },
        { line: 53, text: 'Calcula el retraso usando retroceso exponencial con un límite máximo.' },
        { line: 59, text: 'Añade jitter para evitar sincronización de reintentos entre clientes.' },
        { line: 66, text: 'Espera el tiempo calculado antes del siguiente intento.' },
        { line: 82, text: 'Si se agotan todos los reintentos, lanza una excepción con la causa original.' },
        { line: 87, text: 'Sobrecarga del método principal con valores predeterminados para simplificar su uso.' },
        { line: 91, text: 'Ejemplo de uso que muestra cómo utilizar el mecanismo de retry.' }
      ]
    }
  },
  
  theory: {
    background: 'El patrón Retry es una técnica de resiliencia básica que reconoce que muchos fallos en sistemas distribuidos son transitorios por naturaleza. Problemas como congestión de red, bloqueos temporales de bases de datos o picos de carga suelen resolverse automáticamente con el tiempo. Este patrón es uno de los más fundamentales en la construcción de sistemas distribuidos robustos y ha existido desde los primeros días de la computación en red, aunque fue formalizado como patrón de diseño con el auge de los microservicios y sistemas distribuidos a gran escala.',
    
    problem: 'En entornos distribuidos, las operaciones pueden fallar por razones transitorias que se resolverían simplemente reintentando la operación después de un breve período. Si no se manejan estos fallos, pueden propagarse al usuario final o a otros sistemas, degradando la experiencia o causando fallos en cascada. Además, en sistemas con múltiples componentes, la probabilidad de fallos transitorios aumenta significativamente, lo que hace que la gestión adecuada de estos fallos sea esencial para mantener la estabilidad global del sistema. Los fallos transitorios típicos incluyen timeouts de red, errores de conexión, contención de recursos, y limitación de tasa (rate limiting) en servicios externos.',
    
    solution: 'Implementar un mecanismo que detecte fallos específicos considerados transitorios y reintente automáticamente la operación fallida siguiendo una política predefinida. Estas políticas suelen incluir el número máximo de reintentos, el intervalo entre intentos, y estrategias de espaciado como retroceso exponencial y jitter (variación aleatoria). El mecanismo debe distinguir entre errores transitorios (que deberían reintentarse) y errores permanentes (que deberían propagarse inmediatamente). También debe implementar estrategias para prevenir sobrecarga adicional al sistema ya degradado, como aumentar progresivamente los intervalos entre reintentos.',
    
    applicability: [
      'Comunicaciones de red y llamadas a APIs externas',
      'Operaciones de entrada/salida como acceso a bases de datos o sistemas de archivos',
      'Cuando se interactúa con sistemas que experimentan contención de recursos',
      'Peticiones a servicios que implementan limitación de tasa (rate limiting)',
      'Transacciones distribuidas que pueden fallar por problemas de concurrencia',
      'Procesamiento de colas de mensajes donde pueden ocurrir fallos temporales',
      'Operaciones de almacenamiento en la nube que pueden fallar por razones transitorias',
      'Situaciones donde los servicios se están reiniciando o escalando dinámicamente',
      'Entornos de microservicios con alta volatilidad y disponibilidad variable',
      'Sistemas con comunicación a través de redes no confiables o de alta latencia'
    ],
    
    consequences: [
      'Mayor resiliencia ante fallos transitorios',
      'Mejora de la disponibilidad percibida por el usuario',
      'Reducción de errores que requieren intervención manual',
      'Incremento en latencia cuando ocurren fallos',
      'Riesgo de agravar problemas si los reintentos no se implementan correctamente (por ejemplo, sin retroceso exponencial)',
      'Posible consumo adicional de recursos si muchos clientes reintentan simultáneamente',
      'Complejidad adicional en el código y en la gestión de errores',
      'Dificultad para depurar problemas cuando se ocultan fallos transitorios',
      'Riesgo de ejecutar operaciones múltiples veces si no son idempotentes',
      'Potencial degradación del rendimiento global del sistema durante periodos de inestabilidad'
    ]
  },
  
  notes: `
    <h3>¿Cuándo DEBES usar el patrón Retry?</h3>
    <ul>
      <li><strong>Operaciones de red:</strong> Siempre que hagas llamadas a servicios remotos, APIs externas o cualquier comunicación a través de la red, donde los fallos transitorios son comunes.</li>
      <li><strong>Servicios con alta variabilidad:</strong> Al interactuar con servicios que tienen disponibilidad variable o están sujetos a autoscaling, donde las instancias pueden aparecer y desaparecer.</li>
      <li><strong>Servicios con rate limiting:</strong> Para gestionar adecuadamente las respuestas 429 (Too Many Requests) de servicios que implementan limitación de tasa.</li>
      <li><strong>Recursos con contención:</strong> Al acceder a recursos compartidos que pueden experimentar contención temporal, como bases de datos o sistemas de archivos.</li>
      <li><strong>Operaciones idempotentes:</strong> Preferentemente para operaciones que pueden repetirse sin efectos secundarios (o donde esos efectos son manejables).</li>
      <li><strong>Componentes críticos:</strong> Para aumentar la confiabilidad de operaciones esenciales para el funcionamiento del sistema.</li>
    </ul>
    
    <h3>Estrategias comunes de reintento:</h3>
    <ul>
      <li><strong>Reintento inmediato:</strong> Reintenta la operación inmediatamente después del fallo. Simple pero potencialmente problemático si el fallo es por sobrecarga.</li>
      <li><strong>Reintento con intervalo fijo:</strong> Espera un tiempo fijo entre reintentos. Mejor que el inmediato, pero puede causar sincronización de reintentos entre múltiples clientes.</li>
      <li><strong>Retroceso exponencial:</strong> Incrementa progresivamente el tiempo de espera entre reintentos (por ejemplo, 1s, 2s, 4s, 8s, etc.). Evita sobrecargar el sistema y da más tiempo para recuperación.</li>
      <li><strong>Retroceso exponencial con jitter:</strong> Añade una variación aleatoria al tiempo de espera exponencial. Previene la sincronización de reintentos entre múltiples clientes.</li>
      <li><strong>Reintento decorrelacionado:</strong> Técnica avanzada que utiliza variables aleatorias no correlacionadas para calcular los tiempos de espera, minimizando la probabilidad de sincronización.</li>
    </ul>
    
    <h3>Mejores prácticas para implementar Retry:</h3>
    <ul>
      <li><strong>Identificar errores retryables:</strong> Distingue claramente entre errores transitorios (reintentar) y permanentes (fallar rápido).</li>
      <li><strong>Limitar el número de reintentos:</strong> Establece un límite máximo de intentos para evitar bucles indefinidos.</li>
      <li><strong>Usar retroceso exponencial con jitter:</strong> Implementa estrategias de espaciado progresivo con variación aleatoria para prevenir tormentas de reintentos.</li>
      <li><strong>Considerar la idempotencia:</strong> Asegúrate de que las operaciones reintentadas sean idempotentes o que los efectos de múltiples ejecuciones sean manejados adecuadamente.</li>
      <li><strong>Integrar con circuit breaker:</strong> Combina retry con circuit breaker para evitar reintentos innecesarios cuando un servicio está completamente caído.</li>
      <li><strong>Registrar y monitorizar:</strong> Registra cada reintento y monitoriza patrones para ajustar las políticas o identificar problemas sistémicos.</li>
      <li><strong>Configuración adaptable:</strong> Permite ajustar los parámetros de reintento según el contexto específico de cada operación.</li>
      <li><strong>Considerar el impacto sistémico:</strong> Evalúa cómo los reintentos de múltiples clientes pueden afectar al sistema global, especialmente durante incidentes.</li>
    </ul>
    
    <h3>Ejemplo de implementación avanzada:</h3>
    <pre>
// Retry con estrategia adaptativa basada en el tipo de operación y estado del sistema
class AdaptiveRetryStrategy {
  constructor(options = {}) {
    this.baseOptions = {
      maxRetries: options.maxRetries || 3,
      baseDelay: options.baseDelay || 1000,
      maxDelay: options.maxDelay || 30000,
      jitterFactor: options.jitterFactor || 0.2,
      timeout: options.timeout || 60000 // Tiempo máximo total para todos los intentos
    };
    
    // Métricas para ajustar dinámicamente la estrategia
    this.failureStats = {
      lastFailureTime: 0,
      consecutiveFailures: 0,
      failuresByOperation: new Map()
    };
  }
  
  // Calcula los parámetros de retry según el contexto
  calculateRetryParams(operationKey, error) {
    const stats = this.failureStats;
    const opStats = stats.failuresByOperation.get(operationKey) || { failures: 0 };
    
    // Factores que influyen en la estrategia
    const isRateLimited = error.status === 429;
    const isServerError = error.status >= 500;
    const highFailureRate = opStats.failures > 10;
    const recentFailure = (Date.now() - stats.lastFailureTime) < 5000;
    const systemUnderStress = stats.consecutiveFailures > 5;
    
    // Ajustar parámetros según el contexto
    let params = {...this.baseOptions};
    
    if (isRateLimited) {
      // Para rate limiting, esperar más tiempo entre intentos
      params.baseDelay = Math.max(2000, this.baseOptions.baseDelay);
      // Usar el Retry-After header si está disponible
      if (error.headers && error.headers['retry-after']) {
        const retryAfter = parseInt(error.headers['retry-after'], 10);
        if (!isNaN(retryAfter)) {
          params.baseDelay = retryAfter * 1000;
        }
      }
    }
    
    if (systemUnderStress || highFailureRate) {
      // Reducir la presión si hay muchos fallos
      params.maxRetries = Math.max(1, this.baseOptions.maxRetries - 1);
      params.jitterFactor = 0.3; // Mayor jitter para más dispersión
    }
    
    if (isServerError && recentFailure) {
      // Esperar más tiempo para errores de servidor recientes
      params.baseDelay = Math.min(this.baseOptions.maxDelay, params.baseDelay * 2);
    }
    
    return params;
  }
  
  // Actualiza estadísticas después de un fallo
  recordFailure(operationKey, error) {
    const stats = this.failureStats;
    stats.lastFailureTime = Date.now();
    stats.consecutiveFailures++;
    
    if (!stats.failuresByOperation.has(operationKey)) {
      stats.failuresByOperation.set(operationKey, { failures: 0 });
    }
    
    const opStats = stats.failuresByOperation.get(operationKey);
    opStats.failures++;
  }
  
  // Actualiza estadísticas después de un éxito
  recordSuccess(operationKey) {
    const stats = this.failureStats;
    stats.consecutiveFailures = 0;
    
    if (stats.failuresByOperation.has(operationKey)) {
      const opStats = stats.failuresByOperation.get(operationKey);
      opStats.failures = Math.max(0, opStats.failures - 1);
    }
  }
  
  // Ejecuta una operación con política adaptativa de reintentos
  async execute(operationKey, operation) {
    const startTime = Date.now();
    let attempt = 0;
    let lastError;
    
    while (true) {
      try {
        const result = await operation();
        this.recordSuccess(operationKey);
        return result;
      } catch (error) {
        lastError = error;
        this.recordFailure(operationKey, error);
        
        // Comprobar si el error es retryable
        if (!this.isRetryableError(error)) {
          throw error;
        }
        
        // Calcular parámetros adaptados al contexto actual
        const params = this.calculateRetryParams(operationKey, error);
        attempt++;
        
        // Comprobar si hemos agotado los reintentos o el timeout total
        if (attempt > params.maxRetries || (Date.now() - startTime) > params.timeout) {
          throw new Error(\`Operación fallida después de \${attempt} intentos: \${error.message}\`, { cause: error });
        }
        
        // Calcular retraso con backoff exponencial y jitter
        const exponentialDelay = Math.min(
          params.maxDelay,
          params.baseDelay * Math.pow(2, attempt - 1)
        );
        
        const jitter = exponentialDelay * params.jitterFactor * (Math.random() * 2 - 1);
        const delay = Math.max(0, exponentialDelay + jitter);
        
        console.log(\`[\${operationKey}] Reintento #\${attempt} después de \${Math.round(delay)}ms\`);
        
        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Determina si un error es retryable
  isRetryableError(error) {
    // Códigos de error de red comunes
    const networkErrors = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND'];
    
    // Códigos HTTP retryables
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    
    return (
      networkErrors.some(code => error.code === code) ||
      retryableStatusCodes.includes(error.status) ||
      error.message.includes('timeout') ||
      error.message.includes('temporarily unavailable')
    );
  }
}

// Uso
const retry = new AdaptiveRetryStrategy();

async function fetchData(resourceId) {
  return retry.execute(\`fetch-\${resourceId}\`, async () => {
    const response = await fetch(\`https://api.example.com/resources/\${resourceId}\`);
    
    if (!response.ok) {
      const error = new Error(\`HTTP error \${response.status}\`);
      error.status = response.status;
      error.headers = Object.fromEntries(response.headers.entries());
      throw error;
    }
    
    return response.json();
  });
}
    </pre>
    
    <h3>Retry vs otros patrones de resiliencia:</h3>
    <ul>
      <li><strong>Retry vs Circuit Breaker:</strong> Retry intenta manejar fallos transitorios mediante reintentos, mientras que Circuit Breaker previene sobrecarga adicional al detectar fallos persistentes y bloquear temporalmente las llamadas. Son complementarios y a menudo se usan juntos.</li>
      <li><strong>Retry vs Timeout:</strong> Timeout establece un límite máximo de tiempo para una operación, mientras que Retry maneja qué hacer cuando una operación falla. Ambos son importantes: Timeout evita bloqueos indefinidos, y Retry maneja los fallos de manera elegante.</li>
      <li><strong>Retry vs Fallback:</strong> Retry intenta la misma operación múltiples veces esperando que eventualmente funcione, mientras que Fallback proporciona una alternativa cuando una operación falla persistentemente. Se pueden combinar: intentar varias veces y luego recurrir a una alternativa.</li>
      <li><strong>Retry vs Bulkhead:</strong> Retry maneja fallos individuales, mientras que Bulkhead aísla componentes para prevenir que los fallos se propaguen. Bulkhead puede proporcionar el aislamiento necesario para que los reintentos no afecten a otros componentes.</li>
    </ul>
    
    <h3>Consideraciones específicas por tipo de operación:</h3>
    <ul>
      <li><strong>APIs HTTP externas:</strong> Usar reintentos para códigos 429, 5xx. Respetar headers Retry-After. Combinar con Circuit Breaker.</li>
      <li><strong>Bases de datos:</strong> Reintentar errores de conexión y deadlocks. Considerar timeouts más largos para operaciones complejas.</li>
      <li><strong>Colas de mensajes:</strong> Implementar reintentos tanto a nivel de publicación como de consumo. Considerar dead-letter queues después de múltiples fallos.</li>
      <li><strong>Sistemas de archivos:</strong> Manejar bloqueos temporales y errores de I/O. Usar retroceso exponencial para operaciones en recursos compartidos.</li>
      <li><strong>Comunicación entre microservicios:</strong> Combinar Retry con Circuit Breaker y monitoring. Ajustar políticas según la criticidad de cada servicio.</li>
    </ul>
  `
};

export default retryPattern; 