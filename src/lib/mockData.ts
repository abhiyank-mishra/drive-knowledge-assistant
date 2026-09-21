import { DocumentItem } from "../types";

export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-os-01",
    title: "Operating Systems - Unit 3: Deadlocks & CPU Scheduling",
    subject: "Operating Systems",
    source: "sample",
    driveUrl: "https://drive.google.com/file/d/1A2B3C4D_sample_os_unit3/view",
    fileType: "pdf",
    size: "2.4 MB",
    updatedAt: "Today, 10:30 AM",
    content: `Unit 3: Process Synchronization, CPU Scheduling, and Deadlocks.
Key Topics:
1. CPU Scheduling: First Come First Serve (FCFS), Shortest Job First (SJF), Round Robin (RR), Priority Scheduling.
   - Turnaround Time = Completion Time - Arrival Time
   - Waiting Time = Turnaround Time - Burst Time
2. Deadlocks: A state where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.
   - Four Necessary Conditions (Coffman Conditions):
     a) Mutual Exclusion: Non-shareable resources.
     b) Hold and Wait: A process must be holding at least one resource and waiting for additional resources.
     c) No Preemption: Resources cannot be preempted.
     d) Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next.
3. Banker's Algorithm: A deadlock avoidance algorithm developed by Edsger Dijkstra.
   - Safety Algorithm: Checks if system is in safe state.
   - Resource-Request Algorithm: Determines whether requests can be safely granted.
   - Need Matrix = Max Matrix - Allocation Matrix.`,
    summary: {
      executiveSummary: [
        "Covers core OS concepts: CPU Scheduling metrics, Deadlock conditions, and Banker's Algorithm avoidance.",
        "Crucial formulas: Turnaround Time = Completion - Arrival; Waiting Time = Turnaround - Burst Time.",
        "Deadlocks require all 4 Coffman conditions simultaneously to occur."
      ],
      keyConcepts: [
        {
          title: "Coffman Conditions for Deadlock",
          explanation: "Deadlock occurs only if Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait are all true at the exact same moment."
        },
        {
          title: "Banker's Algorithm",
          explanation: "Deadlock avoidance technique that tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources."
        },
        {
          title: "Round Robin Scheduling",
          explanation: "Preemptive algorithm designed for time-sharing systems where each process gets a small unit of CPU time (Time Quantum)."
        }
      ],
      formulasAndDefinitions: [
        "Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)",
        "Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)",
        "Need Matrix [i, j] = Max [i, j] - Allocation [i, j]",
        "Deadlock Definition: A condition where processes are permanently blocked because resources required are held by other blocked processes."
      ],
      examImportantTopics: [
        "Explain 4 Coffman conditions with real-world examples (10 Marks).",
        "Banker's Algorithm numerical on Safety State and Resource Request (15 Marks).",
        "Comparison table: FCFS vs SJF vs Round Robin with Gantt Charts (10 Marks)."
      ],
      quickRecapHindi: "Yeh notes Operating Systems ke Unit 3 ke hain. Isme CPU Scheduling ke formulas, Deadlock ke 4 zaroori conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait) aur Dijkstra ka Banker's Algorithm detailed samjhaya gaya hai. Exam ke numericals ke liye Need = Max - Allocation yaad rakhna zaroori hai!"
    },
    flashcards: [
      {
        id: "fc-os-1",
        question: "What are the 4 Coffman conditions for Deadlock?",
        answer: "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
        difficulty: "easy"
      },
      {
        id: "fc-os-2",
        question: "How do you calculate Need Matrix in Banker's Algorithm?",
        answer: "Need[i, j] = Max[i, j] - Allocation[i, j].",
        difficulty: "medium"
      },
      {
        id: "fc-os-3",
        question: "What is the formula for Waiting Time in CPU scheduling?",
        answer: "Waiting Time = Turnaround Time - Burst Time.",
        difficulty: "easy"
      },
      {
        id: "fc-os-4",
        question: "Why is Round Robin algorithm suited for time-sharing OS?",
        answer: "Because it uses a fixed Time Quantum to prevent process starvation and gives fair CPU share to all active processes.",
        difficulty: "hard"
      }
    ]
  },
  {
    id: "doc-dbms-02",
    title: "DBMS - Normalization & ACID Properties",
    subject: "Database Systems",
    source: "sample",
    driveUrl: "https://drive.google.com/file/d/1X9Y8Z_sample_dbms_normal/view",
    fileType: "doc",
    size: "1.8 MB",
    updatedAt: "Yesterday",
    content: `DBMS Lecture 8: Normalization and Transaction Processing.
1. Normal Forms:
   - 1NF: Atomic values, no repeating groups.
   - 2NF: Must be in 1NF + No Partial Dependency (all non-key attributes fully functionally dependent on candidate key).
   - 3NF: Must be in 2NF + No Transitive Dependency (non-key attribute determines another non-key attribute).
   - BCNF (Boyce-Codd NF): For every functional dependency X -> Y, X must be a Super Key.
2. ACID Properties:
   - Atomicity: All or nothing (Rollback / Commit).
   - Consistency: Preserves DB validity before and after execution.
   - Isolation: Concurrent transactions do not interfere with each other.
   - Durability: Once committed, updates persist even across system crashes.`,
    summary: {
      executiveSummary: [
        "Covers relational database normalization rules from 1NF to BCNF.",
        "Explains ACID transactions guaranteeing relational database integrity.",
        "Key focus: Removing anomalies (Insertion, Deletion, Update anomalies)."
      ],
      keyConcepts: [
        {
          title: "Transitive Dependency (3NF)",
          explanation: "Occurs when A -> B and B -> C, meaning A determines C indirectly through non-prime attribute B. 3NF eliminates this."
        },
        {
          title: "BCNF vs 3NF",
          explanation: "BCNF is a stricter version of 3NF where every determinant X in X -> Y must strictly be a Super Key."
        }
      ],
      formulasAndDefinitions: [
        "1NF: Atomic attributes only.",
        "2NF = 1NF + No Partial Dependencies.",
        "3NF = 2NF + No Transitive Dependencies.",
        "BCNF: In X -> Y, X must be a Super Key.",
        "ACID: Atomicity, Consistency, Isolation, Durability."
      ],
      examImportantTopics: [
        "Difference between 3NF and BCNF with a relational schema example.",
        "Explain ACID properties with an example of bank fund transfer.",
        "Solve candidate key finding and dependency preserving decomposition."
      ],
      quickRecapHindi: "Is document me DBMS ki Normalization (1NF, 2NF, 3NF, BCNF) aur ACID properties explain ki gayi hain. Exam me Bank Transaction ke example ke sath ACID aur 3NF vs BCNF ka difference hamesha pucha jata hai!"
    },
    flashcards: [
      {
        id: "fc-dbms-1",
        question: "What is Partial Dependency and which Normal Form removes it?",
        answer: "When a non-prime attribute depends on a proper subset of candidate key. 2NF removes partial dependency.",
        difficulty: "medium"
      },
      {
        id: "fc-dbms-2",
        question: "What makes BCNF stricter than 3NF?",
        answer: "In BCNF, in any functional dependency X -> Y, X must be a super key with no exceptions.",
        difficulty: "hard"
      },
      {
        id: "fc-dbms-3",
        question: "Which ACID property ensures committed data survives system crash?",
        answer: "Durability.",
        difficulty: "easy"
      }
    ]
  },
  {
    id: "doc-ml-03",
    title: "Machine Learning - Neural Networks & Gradient Descent",
    subject: "Machine Learning",
    source: "sample",
    driveUrl: "https://drive.google.com/file/d/1M2L3K_sample_ml_nn/view",
    fileType: "slides",
    size: "3.5 MB",
    updatedAt: "2 days ago",
    content: `Machine Learning Notes: Artificial Neural Networks (ANN).
1. Perceptron: The fundamental building block. Output = ActivationFunction(sum(w_i * x_i) + b).
2. Activation Functions:
   - Sigmoid: σ(z) = 1 / (1 + e^(-z)) (Range: 0 to 1)
   - ReLU (Rectified Linear Unit): f(x) = max(0, x)
   - Softmax: Used for multi-class probability distribution.
3. Loss Function:
   - Mean Squared Error (MSE) for regression.
   - Binary Cross-Entropy / Categorical Cross-Entropy for classification.
4. Gradient Descent:
   - Weight update rule: w_new = w_old - alpha * (dL / dw)
   - Learning Rate (alpha) determines the step size.
   - Vanishing Gradient Problem: Occurs when gradients become too small during backpropagation with deep sigmoid networks.`,
    summary: {
      executiveSummary: [
        "Fundamental architecture of Feedforward Neural Networks and Multilayer Perceptrons.",
        "Mathematical breakdown of popular activation functions (Sigmoid, ReLU, Softmax).",
        "Optimization via Gradient Descent and the Vanishing Gradient problem."
      ],
      keyConcepts: [
        {
          title: "Backpropagation",
          explanation: "Algorithm using the chain rule of calculus to compute the gradient of the loss function with respect to each weight in reverse order."
        },
        {
          title: "Vanishing Gradient Problem",
          explanation: "When derivatives of activations like Sigmoid (max derivative 0.25) multiply across layers, gradients exponentially diminish, preventing early layers from training."
        }
      ],
      formulasAndDefinitions: [
        "Perceptron Output: y = f(W^T X + b)",
        "Sigmoid Function: σ(z) = 1 / (1 + e^(-z))",
        "ReLU: f(z) = max(0, z)",
        "Gradient Descent Rule: θ := θ - α ∇J(θ)"
      ],
      examImportantTopics: [
        "Derivation of Backpropagation weight update using Chain Rule.",
        "Why ReLU is preferred over Sigmoid in hidden layers.",
        "Overfitting prevention: Dropout, L1/L2 Regularization."
      ],
      quickRecapHindi: "Yeh ML lecture notes Artificial Neural Networks ke baare me hain: Perceptron formula, Sigmoid aur ReLU activation functions, Gradient Descent ka weight update rule aur Backpropagation algorithm. Exam ke liye Chain rule derivation aur vanishing gradient reason prepare karna zaroori hai!"
    },
    flashcards: [
      {
        id: "fc-ml-1",
        question: "What is the formula for the Sigmoid activation function?",
        answer: "σ(z) = 1 / (1 + e^(-z)).",
        difficulty: "easy"
      },
      {
        id: "fc-ml-2",
        question: "Why does ReLU help solve the vanishing gradient problem?",
        answer: "Because for positive inputs (z > 0), the gradient is constant 1, preventing the gradient from decaying towards zero across layers.",
        difficulty: "medium"
      }
    ]
  }
];
