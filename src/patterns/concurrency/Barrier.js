const barrierPattern = {
  id: 'barrier',
  name: 'Barrier',
  category: 'concurrency',
  description: 'Permite que múltiples hilos o procesos se esperen mutuamente en un punto específico de su ejecución, para continuar sólo cuando todos hayan llegado a ese punto, sincronizando así fases de computación paralela.',
  theory: {
    background: 'El patrón Barrier es un primitivo de sincronización fundamental en programación concurrente y paralela. Surgió de la necesidad de coordinar múltiples hilos de ejecución en algoritmos que trabajan en fases sincronizadas, especialmente en computación científica y procesamiento paralelo. A diferencia de otros mecanismos como semáforos o mutexes que controlan el acceso a recursos compartidos, las barreras coordinan el progreso temporal de múltiples hilos.',
    problem: 'En computación paralela, a menudo es necesario dividir un algoritmo en fases donde todos los hilos deben completar la fase actual antes de que cualquiera pueda continuar con la siguiente. Sin un mecanismo de sincronización, pueden surgir problemas: 1) Algunos hilos pueden avanzar a la siguiente fase mientras otros aún procesan la fase actual, 2) Los resultados parciales de una fase pueden no estar disponibles para todos los hilos cuando se necesitan, 3) La consistencia de datos compartidos puede verse comprometida, 4) El orden de las operaciones entre fases puede alterarse, 5) La carga de trabajo puede desequilibrarse, reduciendo la eficiencia global.',
    solution: 'Implementar un mecanismo de sincronización que: a) Establece un punto de barrera en el código donde cada hilo debe detenerse, b) Lleva un conteo de los hilos que han llegado a la barrera, c) Bloquea cada hilo hasta que todos los demás hayan llegado a ese punto, d) Libera a todos los hilos simultáneamente una vez que el último hilo llega a la barrera, e) Opcionalmente, restablece el estado de la barrera para permitir su reutilización en ciclos iterativos.',
    applicability: [
      'Algoritmos paralelos divididos en fases secuenciales donde cada fase depende de la finalización de la anterior',
      'Simulaciones científicas donde cada paso temporal debe completarse en todos los nodos antes de avanzar',
      'Procesamiento de imágenes o matrices en bloques donde se requiere que todos los bloques se procesen antes de pasar a la siguiente transformación',
      'Aplicaciones de renderizado gráfico que requieren sincronización entre etapas de procesamiento',
      'Algoritmos iterativos donde cada iteración debe completarse totalmente antes de comenzar la siguiente',
      'Cuando se necesita esperar que un conjunto de hilos de trabajo completen su inicialización antes de comenzar el procesamiento real'
    ],
    consequences: [
      'Permite la sincronización efectiva de múltiples hilos en puntos específicos del algoritmo',
      'Garantiza la consistencia de datos entre fases de cómputo',
      'Simplifica el razonamiento sobre algoritmos concurrentes complejos',
      'Puede introducir overhead debido al bloqueo y la sincronización',
      'Puede causar pérdida de rendimiento si los hilos tienen cargas de trabajo desequilibradas',
      'Potencial para deadlocks si se configura incorrectamente o si algunos hilos no llegan a la barrera',
      'Riesgo de underutilización de recursos mientras los hilos más rápidos esperan a los más lentos'
    ]
  },
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <vector>
#include <functional>
#include <chrono>

class Barrier {
private:
    std::mutex mutex;
    std::condition_variable condition;
    std::size_t threshold;
    std::size_t count;
    std::size_t generation;

public:
    explicit Barrier(std::size_t count) 
        : threshold(count), count(count), generation(0) {}

    void wait() {
        std::unique_lock<std::mutex> lock(mutex);
        std::size_t gen = generation;

        if (--count == 0) {
            // El último hilo que llega a la barrera reinicia el contador
            // e incrementa la generación para evitar falsas liberaciones
            generation++;
            count = threshold;
            // Notifica a todos los hilos en espera
            condition.notify_all();
        } else {
            // Los demás hilos esperan hasta que el contador llegue a cero o la generación cambie
            condition.wait(lock, [this, gen] { return gen != generation; });
        }
    }
};

// Función de ejemplo para demostrar el uso de la barrera
void workerFunction(int id, Barrier& barrier, int iterations) {
    for (int i = 0; i < iterations; ++i) {
        // Simula trabajo en la fase 1
        std::cout << "Hilo " << id << " trabajando en fase 1, iteración " << i << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(100 + id * 50));  // Trabajo variable
        
        std::cout << "Hilo " << id << " llegó a la barrera de la fase 1" << std::endl;
        barrier.wait();  // Todos los hilos se sincronizan aquí
        
        // Fase 2 - solo comienza cuando todos los hilos hayan terminado la fase 1
        std::cout << "Hilo " << id << " comenzando fase 2, iteración " << i << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(150));  // Trabajo de fase 2
        
        std::cout << "Hilo " << id << " llegó a la barrera de la fase 2" << std::endl;
        barrier.wait();  // Todos los hilos se sincronizan nuevamente
        
        // Todos los hilos están sincronizados antes de la siguiente iteración
        if (id == 0) {  // Solo el hilo 0 imprime un separador
            std::cout << "\n-------- Iteración " << i << " completada --------\n" << std::endl;
        }
    }
}

int main() {
    const int numThreads = 4;
    const int iterations = 3;
    
    // Crea una barrera para 4 hilos
    Barrier barrier(numThreads);
    
    std::vector<std::thread> threads;
    
    // Crea y lanza los hilos
    for (int i = 0; i < numThreads; ++i) {
        threads.emplace_back(workerFunction, i, std::ref(barrier), iterations);
    }
    
    // Espera a que todos los hilos terminen
    for (auto& thread : threads) {
        thread.join();
    }
    
    std::cout << "Todos los hilos han terminado." << std::endl;
    return 0;
}`,
      explanation: [
        { line: 8, text: "Definición de la clase Barrier para sincronizar múltiples hilos." },
        { line: 10, text: "Variables privadas para implementar la barrera: mutex para la exclusión mutua, variable de condición para las notificaciones." },
        { line: 13, text: "Threshold mantiene el número total de hilos, count lleva el conteo actual y generation previene falsas notificaciones." },
        { line: 16, text: "Constructor que inicializa la barrera con el número de hilos que deben sincronizarse." },
        { line: 19, text: "Método wait donde los hilos se bloquean hasta que todos hayan llegado a la barrera." },
        { line: 22, text: "Decrementamos el contador y verificamos si somos el último hilo en llegar." },
        { line: 25, text: "El último hilo incrementa la generación para distinguir ciclos, reinicia el contador." },
        { line: 28, text: "Notifica a todos los hilos que están esperando que pueden continuar." },
        { line: 30, text: "Los hilos que no son los últimos esperan hasta que la generación cambie, lo que indica que el último hilo ha llegado." },
        { line: 37, text: "Función que simula el trabajo de un hilo utilizando la barrera para sincronización." },
        { line: 40, text: "Fase 1 del trabajo con tiempo variante para simular cargas desiguales." },
        { line: 43, text: "El hilo llega a la barrera y espera a que todos los demás hilos terminen la fase 1." },
        { line: 46, text: "Fase 2 del trabajo que solo comienza cuando todos los hilos han completado la fase 1." },
        { line: 49, text: "Segunda barrera para asegurar que todos los hilos completen la fase 2 antes de la siguiente iteración." },
        { line: 59, text: "Creación de la barrera especificando el número de hilos." },
        { line: 64, text: "Lanzamiento de los hilos trabajadores, pasando la barrera por referencia." },
        { line: 69, text: "Espera a que todos los hilos terminen su trabajo." }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <thread>
#include <barrier> // C++20
#include <vector>
#include <chrono>
#include <format> // C++20
#include <string>
#include <mutex>

// Mutex para evitar mezclar la salida de consola
std::mutex consoleMutex;

// Función para imprimir mensajes sincronizados
void log(const std::string& message) {
    std::lock_guard<std::mutex> lock(consoleMutex);
    std::cout << message << std::endl;
}

// Función que se ejecuta cuando todos los hilos alcanzan la barrera
void onCompletion() {
    log("\n-------- Todos los hilos han alcanzado la barrera --------\n");
}

// Simulación de un cálculo paralelo de múltiples fases
void matrixWorker(int id, std::barrier<>& phaseBarrier, const std::vector<std::vector<int>>& matrix, 
                 std::vector<int>& rowSums, std::vector<int>& colSums) {
    const size_t rows = matrix.size();
    const size_t cols = matrix[0].size();

    // Asignamos filas a los hilos (división simple por bloques)
    size_t rowsPerThread = rows / 4;
    size_t startRow = id * rowsPerThread;
    size_t endRow = (id == 3) ? rows : (id + 1) * rowsPerThread;

    // Fase 1: Calcular sumas de filas
    log(std::format("Hilo {} calculando sumas de filas {} a {}", id, startRow, endRow - 1));
    
    for (size_t i = startRow; i < endRow; ++i) {
        int sum = 0;
        for (size_t j = 0; j < cols; ++j) {
            sum += matrix[i][j];
            // Simulamos cálculo intensivo
            std::this_thread::sleep_for(std::chrono::milliseconds(1));
        }
        rowSums[i] = sum;
    }
    
    log(std::format("Hilo {} completó el cálculo de filas", id));
    // Esperamos a que todos los hilos completen esta fase
    phaseBarrier.arrive_and_wait();
    
    // Fase 2: Calcular sumas de columnas
    // Ahora asignamos columnas a los hilos
    size_t colsPerThread = cols / 4;
    size_t startCol = id * colsPerThread;
    size_t endCol = (id == 3) ? cols : (id + 1) * colsPerThread;
    
    log(std::format("Hilo {} calculando sumas de columnas {} a {}", id, startCol, endCol - 1));
    
    for (size_t j = startCol; j < endCol; ++j) {
        int sum = 0;
        for (size_t i = 0; i < rows; ++i) {
            sum += matrix[i][j];
            // Simulamos cálculo intensivo
            std::this_thread::sleep_for(std::chrono::milliseconds(1));
        }
        colSums[j] = sum;
    }
    
    log(std::format("Hilo {} completó el cálculo de columnas", id));
    // Esperamos a que todos los hilos completen esta fase
    phaseBarrier.arrive_and_wait();
    
    // Fase 3: Verificación (solo el hilo 0 realiza esta tarea)
    if (id == 0) {
        int totalRowSum = 0;
        int totalColSum = 0;
        
        for (size_t i = 0; i < rows; ++i) {
            totalRowSum += rowSums[i];
        }
        
        for (size_t j = 0; j < cols; ++j) {
            totalColSum += colSums[j];
        }
        
        log(std::format("Verificación: Suma total por filas = {}, Suma total por columnas = {}", 
                       totalRowSum, totalColSum));
        log(std::format("Las sumas {} iguales", totalRowSum == totalColSum ? "son" : "NO son"));
    }
    
    // Esperamos a que el hilo 0 termine la verificación
    phaseBarrier.arrive_and_wait();
}

int main() {
    const size_t numThreads = 4;
    const size_t matrixSize = 8; // Matriz 8x8 para este ejemplo
    
    // Crear una matriz de ejemplo
    std::vector<std::vector<int>> matrix(matrixSize, std::vector<int>(matrixSize));
    for (size_t i = 0; i < matrixSize; ++i) {
        for (size_t j = 0; j < matrixSize; ++j) {
            matrix[i][j] = (i + 1) * (j + 1); // Valores para el ejemplo
        }
    }
    
    // Vectores para almacenar los resultados
    std::vector<int> rowSums(matrixSize, 0);
    std::vector<int> colSums(matrixSize, 0);
    
    // Barrera con función de completado personalizada
    std::barrier phaseBarrier(numThreads, onCompletion);
    
    // Lanzar hilos
    std::vector<std::thread> threads;
    for (size_t i = 0; i < numThreads; ++i) {
        threads.emplace_back(matrixWorker, i, std::ref(phaseBarrier), 
                            std::ref(matrix), std::ref(rowSums), std::ref(colSums));
    }
    
    // Esperar a que todos los hilos terminen
    for (auto& thread : threads) {
        thread.join();
    }
    
    log("Todos los cálculos han sido completados");
    return 0;
}`,
      explanation: [
        { line: 3, text: "Uso de la clase std::barrier incluida en C++20, que proporciona una implementación estándar del patrón." },
        { line: 6, text: "Uso de std::format para formatear mensajes (también de C++20)." },
        { line: 9, text: "Mutex para coordinar la salida de consola y evitar mezcla de mensajes entre hilos." },
        { line: 18, text: "Función de completado que se ejecuta cuando todos los hilos alcanzan la barrera." },
        { line: 23, text: "Función trabajadora que simula un cálculo paralelo de sumas de filas y columnas de una matriz." },
        { line: 30, text: "División del trabajo por bloques, asignando filas a los hilos." },
        { line: 43, text: "Uso de arrive_and_wait() para que el hilo espere en la barrera hasta que todos los demás lleguen." },
        { line: 46, text: "Segunda fase del cálculo, donde los hilos ahora procesan columnas en lugar de filas." },
        { line: 64, text: "Tercera fase donde solo el hilo 0 realiza una verificación de los resultados." },
        { line: 81, text: "Espera final para asegurar que se complete la verificación antes de continuar." },
        { line: 88, text: "Creación de una matriz de ejemplo para el cálculo." },
        { line: 100, text: "Creación de la barrera con el número de hilos y la función de completado." },
        { line: 103, text: "Lanzamiento de los hilos trabajadores, pasando la barrera y los datos por referencia." },
        { line: 110, text: "Espera a que todos los hilos terminen su trabajo." }
      ]
    },
    java: {
      code: `import java.util.concurrent.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.function.Consumer;

public class BarrierExample {
    
    // Barrera que sincroniza hilos y ejecuta una acción al completarse
    static class PhasedComputation {
        private final CyclicBarrier barrier;
        private final int threadCount;
        private final int phases;
        private volatile boolean complete = false;
        
        public PhasedComputation(int threadCount, int phases, Runnable barrierAction) {
            this.threadCount = threadCount;
            this.phases = phases;
            this.barrier = new CyclicBarrier(threadCount, barrierAction);
        }
        
        public void executePhased(Consumer<Integer> phaseHandler) {
            // Crea y lanza hilos
            List<Thread> threads = new ArrayList<>();
            for (int i = 0; i < threadCount; i++) {
                final int threadId = i;
                Thread thread = new Thread(() -> {
                    try {
                        for (int phase = 0; phase < phases; phase++) {
                            // Ejecuta el trabajo específico de esta fase
                            phaseHandler.accept(phase);
                            
                            // Sincroniza con los demás hilos antes de avanzar
                            System.out.printf("Hilo %d esperando en barrera de fase %d%n", 
                                             threadId, phase);
                            barrier.await();
                            
                            // Todos los hilos están sincronizados aquí
                            System.out.printf("Hilo %d avanzando a fase %d%n", 
                                             threadId, phase + 1);
                        }
                    } catch (InterruptedException | BrokenBarrierException e) {
                        System.err.println("Error en hilo " + threadId + ": " + e.getMessage());
                        Thread.currentThread().interrupt();
                    }
                });
                threads.add(thread);
                thread.start();
            }
            
            // Espera a que todos los hilos terminen
            for (Thread thread : threads) {
                try {
                    thread.join();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
            
            complete = true;
        }
        
        public boolean isComplete() {
            return complete;
        }
    }
    
    // Clase que representa un cálculo paralelo
    static class ParallelSorter {
        private final int[] data;
        private final int[][] localSortedData;
        private final Random random = new Random();
        
        public ParallelSorter(int size, int threadCount) {
            this.data = new int[size];
            this.localSortedData = new int[threadCount][];
            
            // Inicializa con datos aleatorios
            for (int i = 0; i < size; i++) {
                data[i] = random.nextInt(10000);
            }
        }
        
        public void parallelSort(int threadCount) {
            final int dataSize = data.length;
            final int sizePerThread = dataSize / threadCount;
            
            // Crea computación por fases con 3 fases:
            // 1. División y ordenamiento local
            // 2. Fusión parcial
            // 3. Fusión final
            PhasedComputation computation = new PhasedComputation(threadCount, 3, () -> {
                System.out.println("=== Fase completada por todos los hilos ===");
            });
            
            computation.executePhased(phase -> {
                // Obtiene el ID del hilo actual
                int threadId = (int) (Thread.currentThread().getId() % threadCount);
                
                if (phase == 0) {
                    // Fase 1: Cada hilo ordena su porción del arreglo
                    int start = threadId * sizePerThread;
                    int end = (threadId == threadCount - 1) ? dataSize : (threadId + 1) * sizePerThread;
                    int[] localData = new int[end - start];
                    
                    System.out.printf("Hilo %d ordenando segmento de %d a %d%n", 
                                     threadId, start, end - 1);
                    
                    // Copia los datos a un arreglo local
                    System.arraycopy(data, start, localData, 0, end - start);
                    
                    // Ordena localmente (simula trabajo con sleep)
                    try {
                        Thread.sleep(100 + random.nextInt(400));
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    
                    java.util.Arrays.sort(localData);
                    localSortedData[threadId] = localData;
                    
                    System.out.printf("Hilo %d completó ordenamiento local%n", threadId);
                } 
                else if (phase == 1) {
                    // Fase 2: Fusión parcial (simula con sleep)
                    System.out.printf("Hilo %d realizando fusión parcial%n", threadId);
                    try {
                        Thread.sleep(200 + random.nextInt(300));
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
                else if (phase == 2) {
                    // Fase 3: Fusión final (solo el hilo 0 realiza la fusión)
                    if (threadId == 0) {
                        System.out.println("Hilo 0 realizando fusión final de todos los segmentos");
                        // En una implementación real, aquí se fusionarían
                        // todos los arreglos ordenados localmente
                        try {
                            Thread.sleep(500);
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                        
                        System.out.println("Fusión completada. Ordenamiento finalizado.");
                    }
                }
            });
            
            if (computation.isComplete()) {
                System.out.println("Ordenamiento paralelo completado con éxito");
            }
        }
    }
    
    public static void main(String[] args) {
        int dataSize = 10000;
        int threadCount = 4;
        
        System.out.println("Iniciando ordenamiento paralelo con " + threadCount + " hilos");
        ParallelSorter sorter = new ParallelSorter(dataSize, threadCount);
        sorter.parallelSort(threadCount);
    }
}`,
      explanation: [
        { line: 8, text: "Clase que encapsula una computación por fases sincronizada con barreras." },
        { line: 9, text: "Uso de CyclicBarrier de Java, que permite reutilizar la barrera para múltiples fases." },
        { line: 15, text: "Constructor que inicializa la barrera con el número de hilos y una acción a ejecutar cuando todos los hilos llegan." },
        { line: 20, text: "Método que ejecuta una computación por fases con un manejador para cada fase." },
        { line: 25, text: "Bucle que ejecuta cada fase del algoritmo." },
        { line: 31, text: "Llamada a await() que bloquea el hilo hasta que todos los hilos lleguen a este punto." },
        { line: 35, text: "Punto donde todos los hilos están sincronizados y avanzan juntos a la siguiente fase." },
        { line: 57, text: "Clase que implementa un ordenamiento paralelo utilizando el patrón Barrier." },
        { line: 76, text: "Creación de una computación por fases con 3 fases específicas para el algoritmo de ordenamiento." },
        { line: 80, text: "Lambda que se ejecuta cuando todos los hilos completan una fase." },
        { line: 84, text: "Obtención del ID del hilo para asignar trabajo específico." },
        { line: 87, text: "Fase 1: División del trabajo y ordenamiento local por cada hilo." },
        { line: 111, text: "Fase 2: Fusión parcial de segmentos ordenados." },
        { line: 120, text: "Fase 3: Fusión final, realizada solo por el hilo 0." },
        { line: 142, text: "Método principal que ejecuta el ejemplo con un conjunto de datos y número de hilos específicos." }
      ]
    }
  },
  comparisons: [
    {
      title: 'Implementación Básica',
      cppTraditional: 'Implementación manual con std::mutex y std::condition_variable para gestión de sincronización.',
      cppModern: 'Utiliza la clase estándar std::barrier introducida en C++20, simplificando el código.',
      java: 'Usa CyclicBarrier integrado en java.util.concurrent que permite reutilización automática.'
    },
    {
      title: 'Funcionalidades Adicionales',
      cppTraditional: 'Implementación básica sin características adicionales, requiere código personalizado para extenderla.',
      cppModern: 'Soporta una función de completado (callback) que se ejecuta cuando todos los hilos alcanzan la barrera.',
      java: 'Ofrece acción de barrera integrada, manejo de timeout, y detección de barrera rota (BrokenBarrierException).'
    },
    {
      title: 'Reutilización',
      cppTraditional: 'Reutilizable a través de mecanismo de generación para evitar falsas notificaciones.',
      cppModern: 'Automáticamente reutilizable para múltiples sincronizaciones.',
      java: 'CyclicBarrier está diseñada específicamente para ser reutilizada en múltiples rondas de sincronización.'
    },
    {
      title: 'Manejo de Errores',
      cppTraditional: 'Limitado, sin mecanismo integrado para manejar fallos en hilos.',
      cppModern: 'Mejora el manejo de errores pero sigue requiriendo código adicional para casos complejos.',
      java: 'BrokenBarrierException para detectar fallos, interrupción de hilos y timeout integrados.'
    }
  ],
  notes: 'El patrón Barrier es esencial en aplicaciones de computación paralela donde se requiere sincronización en puntos específicos de un algoritmo. Su principal ventaja es la capacidad de coordinar múltiples hilos para que avancen juntos a través de fases de computación, garantizando la consistencia de datos entre fases. Sin embargo, puede introducir cuellos de botella si las cargas de trabajo no están bien balanceadas. En implementaciones prácticas, es importante considerar estrategias para minimizar el tiempo que los hilos más rápidos esperan a los más lentos, como la división dinámica del trabajo o técnicas de trabajo-robo (work-stealing). También se debe tener cuidado con posibles deadlocks si un hilo no llega a la barrera por algún error o excepción. Marcos modernos como OpenMP, Threading Building Blocks (TBB) y Java Fork/Join incluyen abstracciones de alto nivel que utilizan barreras internamente para facilitar la programación paralela.'
};

export default barrierPattern; 