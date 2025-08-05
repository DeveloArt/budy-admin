export interface AnalyticsEvents {
  id: string;
  event_name: string;
  timestamp: string;
  session_id: string;
  page_url: string;
  additional_data: {
    image_index: string;
    image_alt: string;
    button_text: string;
    clicked_in: string;
    target_url: string;
    visible_ratio: string;
  };
}
