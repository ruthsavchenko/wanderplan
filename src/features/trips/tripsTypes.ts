export interface Trip {
  id: string
  user_id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  currency: string
  cover_image_url?: string
  created_at: string
}

export interface TripCreate {
  title: string
  destination: string
  start_date: string
  end_date: string
  currency: string
  cover_image_url?: string
}
