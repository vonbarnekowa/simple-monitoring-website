export class Constants {
  // URL
  public static HOME_URL = '/';

  public static LOGIN_GOOGLE_URL = '/login/google';
  public static LOGIN_GOOGLE_CALLBACK_URL = '/login/google/callback';
  public static LOGOUT_URL = '/logout';

  public static DASHBOARD_URL = '/dashboard';
  public static AGENT_URL = '/agent';

  public static ADD_MONITOR_URL = '/monitor/add';
  public static UPDATE_MONITOR_URL = '/monitor/:id/update';
  public static DELETE_MONITOR_URL = '/monitor/:id/delete';

  // Mongodb
  public static MONGODB_CONNECT_URL = 'mongodb://localhost/smw';

  // Messages
  public static GENERIC_ERROR_MESSAGE = 'An error occurred';
  public static MONITOR_ADD_SUCCESS = 'Monitor added successfully';
  public static MONITOR_ADD_ERROR = 'Can\'t add this monitor';
  public static MONITOR_UPDATE_SUCCESS = 'Monitor updated successfully';
  public static MONITOR_UPDATE_ERROR = 'Can\'t update this monitor';
  public static MONITOR_DELETE_SUCCESS = 'Monitor deleted successfully';
  public static MONITOR_DELETE_ERROR = 'Can\'t delete this monitor';
  public static FORM_ERROR_MESSAGE = 'The form wasn\'t correct';
}
