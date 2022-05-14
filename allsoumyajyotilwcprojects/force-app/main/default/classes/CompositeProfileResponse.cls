public class CompositeProfileResponse {

	public class CompositeResponse {
		public Profile body;
		
		public Integer httpStatusCode;
		public String referenceId;
	}
    public class Attributes {
		public String type;
		public String url;
	}
	

	

	public List<CompositeResponse> compositeResponse;

	
	public static CompositeProfileResponse parse(String json) {
		return (CompositeProfileResponse) System.JSON.deserialize(json, CompositeProfileResponse.class);
	}
}