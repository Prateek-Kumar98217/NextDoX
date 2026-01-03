
export type Task = {
    id: string;
    created_at: string;
    project_id: string;
    title: string;
    description?: string;
    status: 'backlog' | 'pending' | 'in-progress' | 'completed';
    completed_at?: string;
    commit_hash?: string;
    rank: number;
}