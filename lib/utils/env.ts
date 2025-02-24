class EnvProvider {
    public nextPublicSupabaseUrl: string;
    public nextPublicSupabaseAnonKey: string;
    constructor() {
        this.nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        this.nextPublicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    }
}

export const env = new EnvProvider();

