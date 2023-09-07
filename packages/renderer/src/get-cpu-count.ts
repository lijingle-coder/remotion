// Kubernetes uses the following command to spawn Docker containers:
// docker run --cpuset-cpus="0,1" to assign only 2 CPUs.
// However, Node.js returns the core count of the host system (up to 96!)

import {execSync} from 'node:child_process';
import {cpus} from 'node:os';

// We also get it from nproc and use the minimum of the two.
const getConcurrencyFromNProc = (): number | null => {
	try {
		return parseInt(execSync('nproc').toString().trim(), 10);
	} catch (error) {
		return null;
	}
};

export const getCpuCount = () => {
	const node = cpus().length;
	const nproc = getConcurrencyFromNProc();
	if (nproc === null) {
		return node;
	}

	return Math.min(nproc, node);
};
