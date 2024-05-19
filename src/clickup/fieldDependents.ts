import { CustomFieldVariable, FieldName, getCustomFieldRegex } from './customField';

interface ReverseDependencyGraph {
    [fieldName: FieldName]: FieldName[];
}

export function createDependencyDetector(variables: CustomFieldVariable[]) {
    const graph = createReverseDependencyGraph(variables);
    return {
        getDirectDependents: (fieldId: FieldName) => getDirectDependents(graph, fieldId),
        getAllDependents: (fieldId: FieldName) => getAllDependents(graph, fieldId),
        hasCycle: () => Object.keys(graph).some(detectCycle(graph)),
    };
}

function createReverseDependencyGraph(variables: CustomFieldVariable[]): ReverseDependencyGraph {
    const reverseGraph: ReverseDependencyGraph = {};
    return variables.reduce(addNodeToGraph, reverseGraph);
}

function addNodeToGraph(graph: ReverseDependencyGraph, v: CustomFieldVariable): ReverseDependencyGraph {
    const dependencies = extractDependencies(v);
    return dependencies.reduce(addDependencyToGraph(v.name), graph);
}

function extractDependencies(variable: CustomFieldVariable): FieldName[] {
    return hasDependencies(variable)
        ? Array.from(variable.value.matchAll(getCustomFieldRegex()), (m: FieldName[]) => m[0])
        : [];
}

function hasDependencies(v: CustomFieldVariable): boolean {
    return v.type === 'formula' && typeof v.value === 'string' && getCustomFieldRegex().test(v.value);
}

function addDependencyToGraph(fieldName: FieldName) {
    return (graph: ReverseDependencyGraph, dependency: FieldName) => {
        if (!graph[dependency]) {
            graph[dependency] = [];
        }
        graph[dependency].push(fieldName);
        return graph;
    };
}

function detectCycle(
    graph: ReverseDependencyGraph,
    visited: Set<FieldName> = new Set(),
    recStack: Set<FieldName> = new Set()
) {
    return function (fieldName: FieldName): boolean {
        if (!visited.has(fieldName)) {
            visited.add(fieldName);
            recStack.add(fieldName);

            const neighbors = getDirectDependents(graph, fieldName);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor) && detectCycle(graph, visited, recStack)(neighbor)) {
                    return true;
                } else if (recStack.has(neighbor)) {
                    return true;
                }
            }
            recStack.delete(fieldName);
        }
        return false;
    };
}

function getDirectDependents(reverseGraph: ReverseDependencyGraph, fieldName: FieldName): FieldName[] {
    return reverseGraph[fieldName] || [];
}

function getAllDependents(reverseGraph: ReverseDependencyGraph, fieldName: FieldName): FieldName[] {
    // const dependents = getDirectDependents(reverseGraph, fieldName);
    // return dependents.reduce((acc, dep) => [...acc, dep, ...getAllDependents(reverseGraph, dep)], dependents);
    const result: FieldName[] = [];
    const visited = new Set<FieldName>();

    function dfs(current: FieldName) {
        if (visited.has(current)) {
            return;
        }
        visited.add(current);
        const directDependents = getDirectDependents(reverseGraph, current);
        for (const dep of directDependents) {
            dfs(dep);
        }
        result.push(current);
    }

    dfs(fieldName);
    result.pop(); // Remove the initial fieldName from the result
    return result.reverse(); // Reverse to get topological order
}

export function haveSameDependencies(a: CustomFieldVariable, b: CustomFieldVariable): boolean {
    const aDeps = extractDependencies(a);
    const bDeps = extractDependencies(b);
    return arraysEqual(aDeps, bDeps);
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const countMap = {};

    // Count elements in the first array
    for (const el of arr1) {
        countMap[el] = (countMap[el] || 0) + 1;
    }

    // Subtract count for elements in the second array
    for (const el of arr2) {
        if (!countMap[el]) {
            return false;
        }
        countMap[el]--;
    }
    const hasNonZeroCount = (countMap) => (key) => countMap[key] !== 0;
    const not = (v: boolean) => !v;
    return not(Object.keys(countMap).some(hasNonZeroCount(countMap)));
}
