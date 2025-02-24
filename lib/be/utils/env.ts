class EnvProvider {
    // if you want to access env from client, it must start with prefix 'nextPublic'
    public nextPublicSupabaseUrl: string;
    public nextPublicSupabaseAnonKey: string;
    public nextPublicDomain: string;
    public nextPublicENV: string;

    constructor() {
        this.nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        this.nextPublicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        this.nextPublicDomain = process.env.NEXT_PUBLIC_DOMAIN!;
        this.nextPublicENV = process.env.NEXT_PUBLIC_ENV!;
    }

    public isLocal(): boolean {
        return this.nextPublicENV === "local";
    }

}

export const env = new EnvProvider();

