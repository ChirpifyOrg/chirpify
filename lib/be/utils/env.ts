class EnvProvider {
    public nextPublicSupabaseUrl: string;
    public nextPublicSupabaseAnonKey: string;
    public nextPublicDomain: string;

    constructor() {
        this.nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        this.nextPublicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        this.nextPublicDomain = process.env.NEXT_PUBLIC_DOMAIN!;
    }
}

export const env = new EnvProvider();

