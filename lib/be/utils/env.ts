class EnvProvider {
    public nextPublicSupabaseUrl: string;
    public nextPublicSupabaseAnonKey: string;
    public domain: string;
    
    constructor() {
        this.nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        this.nextPublicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        this.domain = process.env.DOMAIN!;
    }
}

export const env = new EnvProvider();

