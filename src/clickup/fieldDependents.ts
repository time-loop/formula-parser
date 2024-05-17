import { CustomFieldVariable, getCustomFieldRegex } from './customField';

type FieldId = string;

interface ReverseDependencyGraph {
    [fieldId: FieldId]: Set<FieldId>;
}

const addDependency = (fieldId: FieldId) => (graph: ReverseDependencyGraph, dependency: FieldId) => {
    if (!graph[dependency]) {
        graph[dependency] = new Set();
    }
    graph[dependency].add(fieldId);
    return graph;
};

const hasDependencies = (v: CustomFieldVariable): boolean =>
    v.type === 'formula' && typeof v.value === 'string' && getCustomFieldRegex().test(v.value);

function extractDependencies(variable: CustomFieldVariable): FieldId[] {
    if (hasDependencies(variable)) {
        const dependencies = Array.from(
            variable.value.matchAll(getCustomFieldRegex()),
            (m: FieldId[]) => m[1] as FieldId
        );
        return dependencies;
    }
    return [];
}

const addNodeToGraph = (graph: ReverseDependencyGraph, v: CustomFieldVariable): ReverseDependencyGraph => {
    const dependencies = extractDependencies(v);
    return dependencies.reduce(addDependency(v.id), graph);
};

function createReverseDependencyGraph(variables: CustomFieldVariable[]): ReverseDependencyGraph {
    const reverseGraph: ReverseDependencyGraph = {};
    return variables.reduce(addNodeToGraph, reverseGraph);
}

function detectCycle(
    graph: ReverseDependencyGraph,
    fieldId: FieldId,
    visited: Set<FieldId>,
    recStack: Set<FieldId>
): boolean {
    if (!visited.has(fieldId)) {
        visited.add(fieldId);
        recStack.add(fieldId);

        const neighbors = getDependents(graph, fieldId);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor) && detectCycle(graph, neighbor, visited, recStack)) {
                return true;
            } else if (recStack.has(neighbor)) {
                return true;
            }
        }
    }
    recStack.delete(fieldId);
    return false;
}

export function getDependents(reverseGraph: ReverseDependencyGraph, fieldId: FieldId): FieldId[] {
    const dependencies = reverseGraph[fieldId];
    return dependencies ? Array.from(dependencies) : [];
}

export function createDependencyDetector(variables: CustomFieldVariable[]) {
    const graph = createReverseDependencyGraph(variables);
    const hasCycle = () => {
        const visited = new Set<FieldId>();
        const recStack = new Set<FieldId>();
        return Object.keys(graph).some((fieldId) => detectCycle(graph, fieldId, visited, recStack));
    };

    return {
        getDependents: (fieldId: FieldId) => getDependents(graph, fieldId),
        hasCycle,
    };
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const countMap = {};

    // Count elements in the first array
    for (let el of arr1) {
        countMap[el] = (countMap[el] || 0) + 1;
    }

    // Subtract count for elements in the second array
    for (let el of arr2) {
        if (!countMap[el]) {
            return false;
        }
        countMap[el]--;
    }
    const hasNonZeroCount = (countMap) => (key) => countMap[key] !== 0;
    const not = (v: boolean) => !v;
    return not(Object.keys(countMap).some(hasNonZeroCount(countMap)));
}

export function haveSameDependencies(a: CustomFieldVariable, b: CustomFieldVariable): boolean {
    const aDeps = extractDependencies(a);
    const bDeps = extractDependencies(b);
    return arraysEqual(aDeps, bDeps);
}
