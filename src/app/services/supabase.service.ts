import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private _supabase: SupabaseClient;

  public get supabase(): SupabaseClient {
    return this._supabase;
  }

  constructor() {
    this._supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }
}
