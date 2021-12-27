import { V1ConfigMap, V1Deployment, V1Namespace, V1Node, V1Pod } from '@kubernetes/client-node';

/**
 * Defines base Kubernetes object with common fields.
 *
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#required-fields
 */
export interface KubernetesObject {
	readonly apiVersion: string;
	readonly kind: string;
	readonly metadata: unknown;
	readonly spec: unknown;
}

/**
 * Make a kubernetes list out of kubernetes resource type.
 */
interface KubernetesList<T> {
	readonly apiVersion: string;
	readonly kind: KubernetesObjectKinds.List;
	readonly items: T[];
	readonly metadata: ResultMetadata;
}

// Fix types from `@kubernetes/client-node`
export type Namespace = Required<V1Namespace> & {
	readonly kind: KubernetesObjectKinds.Namespace;
};
export type NamespaceResult = KubernetesList<Namespace>;

export type Deployment = Required<V1Deployment> & {
	readonly kind: KubernetesObjectKinds.Deployment;
};
export type DeploymentResult = KubernetesList<Deployment>;

export type ConfigMap = Required<V1ConfigMap> & {
	readonly kind: KubernetesObjectKinds.ConfigMap;
};
export type ConfigMapResult = KubernetesList<ConfigMap>;

export type Node = Required<V1Node> & {
	readonly kind: KubernetesObjectKinds.Node;
};
export type NodeResult = KubernetesList<Node>;

export type Pod = Required<V1Pod> & {
	readonly kind: KubernetesObjectKinds.Pod;
};
export type PodResult = KubernetesList<Pod>;

/**
 * Defines supported Kubernetes object kinds.
 */
export const enum KubernetesObjectKinds {
	List = 'List',
	Bucket = 'Bucket',
	GitRepository = 'GitRepository',
	HelmRepository = 'HelmRepository',
	HelmRelease = 'HelmRelease',
	Kustomization = 'Kustomization',
	Deployment = 'Deployment',
	Namespace = 'Namespace',
	Node = 'Node',
	Pod = 'Pod',
	ConfigMap = 'ConfigMap',
}

interface KubectlVersion {
	major: string;
	minor: string;
	gitVersion: string;
	gitCommit: string;
	gitTreeState: string;
	buildDate: string;
	goVersion: string;
	compiler: string;
	platform: string;
}

/**
 * The result of running `kubectl version -o json`
 */
export interface KubectlVersionResult {
	clientVersion: KubectlVersion;
	serverVersion: KubectlVersion;
}

export interface ResultMetadata {

	/**
	 * Version of this resource as stored in the underlying database.
	 */
	readonly resourceVersion: '';

	/**
	 * Deprecated in Kubernetes 1.16. Removed in Kubernetes 1.21.
	 */
	readonly selfLink?: '';
}

/**
 * DeploymentCondition describes the state of a deployment at a certain point.
 */
export interface DeploymentCondition {

	/**
	 * Last time the condition transitioned from one status to another
	 */
	lastTransitionTime?: string;

	/**
	 * The last time this condition was updated
	 */
	lastUpdateTime?: string;

	/**
	 * A human readable message indicating details about the transition
	 */
	message?: string;

	/**
	 * The reason for the condition's last transition
	 */
	reason?: string;

	/**
	 * Status of the condition, one of True, False, Unknown
	 */
	status: string;

	/**
	 * Type of deployment condition
	 */
	type: string;
}

/**
 * LocalObjectReference contains enough information
 * to let you locate the referenced object inside the same namespace.
 */
export interface LocalObjectReference {

	/**
	 * Name of the referent.
	 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
	 */
	name: string;
}

/**
 * JSON represents any valid JSON value. These types are supported:
 * bool, int64, float64, string, []interface{}, map[string]interface{} and nil.
 */
export interface KubernetesJSON {
	[key: string]: unknown;
}

/**
 * Artifact represents the output of a source synchronisation.
 */
export interface Artifact {

	/**
	 * Path is the relative file path of this artifact
	 */
	readonly path: string;

	/**
	 * URL is the HTTP address of this artifact
	 */
	readonly url: string;

	/**
	 * Revision is a human readable identifier traceable in the origin source system.
	 * It can be a Git commit SHA, Git tag, a Helm index timestamp,
	 * a Helm chart version, etc.
	 */
	readonly revision?: string;

	/**
	 * Checksum is the SHA1 checksum of the artifact
	 */
	readonly checksum?: string;

	/**
	 * LastUpdateTime is the timestamp corresponding to the last update of this artifact
	 */
	readonly lastUpdateTime: string;
}

/**
 * ObjectMeta is metadata that all persisted resources must have,
 * which includes all objects users must create.
 */
export interface ObjectMeta {

	/**
	 * Annotations is an unstructured key value map stored with a resource
	 * that may be set by external tools to store and retrieve arbitrary metadata.
	 * They are not queryable and should be preserved when modifying objects.
	 * @see http://kubernetes.io/docs/user-guide/annotations
	 */
	annotations?: { [key: string]: string; };

	/**
	 * The name of the cluster which the object belongs to.
	 * This is used to distinguish resources with same name
	 * and namespace in different clusters.
	 * This field is not set anywhere right now,
	 * and apiserver is going to ignore it
	 * if set in create or update request.
	 */
	clusterName?: string;

	/**
	 * CreationTimestamp is a timestamp representing the server time
	 * when this object was created. It is not guaranteed to be set
	 * in happens-before order across separate operations.
	 * Clients may not set this value.
	 * It is represented in RFC3339 form and is in UTC.
	 *
	 * Populated by the system. Read-only. Null for lists.
	 * @see https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
	 */
	creationTimestamp?: string;

	/**
	 * Number of seconds allowed for this object to gracefully terminate
	 * before it will be removed from the system.
	 * Only set when deletionTimestamp is also set.
	 * May only be shortened. Read-only.
	 */
	deletionGracePeriodSeconds?: number;

	/**
	 * DeletionTimestamp is RFC 3339 date and time
	 * at which this resource will be deleted.
	 *
	 * This field is set by the server
	 * when a graceful deletion is requested by the user,
	 * and is not directly settable by a client.
	 *
	 * The resource is expected to be deleted
	 * (no longer visible from resource lists, and not reachable by name)
	 * after the time in this field, once the finalizers list is empty.
	 * As long as the finalizers list contains items, deletion is blocked.
	 *
	 * Once the deletionTimestamp is set,
	 * this value may not be unset or be set further into the future,
	 * although it may be shortened or the resource may be deleted prior to this time.
	 * For example, a user may request that a pod is deleted in 30 seconds.
	 * The Kubelet will react by sending a graceful termination signal
	 * to the containers in the pod. After that 30 seconds,
	 * the Kubelet will send a hard termination signal (SIGKILL)
	 * to the container and after cleanup, remove the pod from the API.
	 * In the presence of network partitions,
	 * this object may still exist after this timestamp,
	 * until an administrator or automated process can determine
	 * the resource is fully terminated.
	 * If not set, graceful deletion of the object has not been requested.
	 *
	 * Populated by the system when a graceful deletion is requested. Read-only.
	 * @see https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
	 */
	deletionTimestamp?: string;

	/**
	 * Must be empty before the object is deleted from the registry.
	 * Each entry is an identifier for the responsible component
	 * that will remove the entry from the list.
	 * If the deletionTimestamp of the object is non-nil,
	 * entries in this list can only be removed.
	 * Finalizers may be processed and removed in any order.
	 * Order is NOT enforced because it introduces significant risk of stuck finalizers.
	 * finalizers is a shared field, any actor with permission can reorder it.
	 * If the finalizer list is processed in order,
	 * then this can lead to a situation in which the component responsible
	 * for the first finalizer in the list is waiting for a signal
	 * (field value, external system, or other) produced by a component
	 * responsible for a finalizer later in the list, resulting in a deadlock.
	 * Without enforced ordering finalizers are free to order amongst themselves
	 * and are not vulnerable to ordering changes in the list.
	 */
	finalizers?: string[];

	/**
	 * GenerateName is an optional prefix, used by the server,
	 * to generate a unique name ONLY IF the Name field has not been provided.
	 * If this field is used, the name returned to the client will be different than the name passed.
	 *
	 * This value will also be combined with a unique suffix.
	 * The provided value has the same validation rules as the Name field,
	 * and may be truncated by the length of the suffix required to make the value unique on the server.
	 *
	 * If this field is specified and the generated name exists,
	 * the server will NOT return a 409 - instead,
	 * it will either return 201 Created or 500 with Reason ServerTimeout
	 * indicating a unique name could not be found in the time allotted,
	 * and the client should retry (optionally after the time indicated in the Retry-After header).
	 *
	 * Applied only if Name is not specified.
	 * @see https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency
	 */
	generateName?: string;

	/**
	 * A sequence number representing a specific generation of the desired state.
	 * Populated by the system. Read-only.
	 */
	generation?: number;

	/**
	 * Map of string keys and values that can be used to organize
	 * and categorize (scope and select) objects.
	 * May match selectors of replication controllers and services.
	 * @see http://kubernetes.io/docs/user-guide/labels
	 */
	labels?: { [key: string]: string; };

	/**
	 * ManagedFields maps workflow-id and version to the set of fields
	 * that are managed by that workflow. This is mostly for internal housekeeping,
	 * and users typically shouldn't need to set or understand this field.
	 * A workflow can be the user's name, a controller's name,
	 * or the name of a specific apply path like "ci-cd".
	 * The set of fields is always in the version
	 * that the workflow used when modifying the object.
	 */
	managedFields?: ManagedFieldsEntry[];

	/**
	 * Name must be unique within a namespace.
	 * Is required when creating resources,
	 * although some resources may allow a client to request
	 * the generation of an appropriate name automatically.
	 * Name is primarily intended for creation idempotence and configuration definition.
	 * Cannot be updated.
	 * @see http://kubernetes.io/docs/user-guide/identifiers#names
	 */
	name?: string;

	/**
	 * Namespace defines the space within which each name must be unique.
	 * An empty namespace is equivalent to the "default" namespace,
	 * but "default" is the canonical representation.
	 * Not all objects are required to be scoped to a namespace -
	 * the value of this field for those objects will be empty.
	 *
	 * Must be a DNS_LABEL. Cannot be updated.
	 * @see http://kubernetes.io/docs/user-guide/namespaces
	 */
	namespace?: string;

	/**
	 * List of objects depended by this object.
	 * If ALL objects in the list have been deleted,
	 * this object will be garbage collected.
	 * If this object is managed by a controller,
	 * then an entry in this list will point to this controller,
	 * with the controller field set to true.
	 * There cannot be more than one managing controller.
	 */
	ownerReferences?: OwnerReference[];

	/**
	 * An opaque value that represents the internal version of this object
	 * that can be used by clients to determine when objects have changed.
	 * May be used for optimistic concurrency, change detection,
	 * and the watch operation on a resource or set of resources.
	 * Clients must treat these values as opaque and passed unmodified back to the server.
	 * They may only be valid for a particular resource or set of resources.
	 *
	 * Populated by the system. Read-only. Value must be treated as opaque by clients.
	 * @see https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
	 */
	resourceVersion?: string;

	/**
	 * SelfLink is a URL representing this object. Populated by the system. Read-only.
	 *
	 * DEPRECATED Kubernetes will stop propagating this field in 1.20 release
	 * and the field is planned to be removed in 1.21 release.
	 */
	selfLink?: string;

	/**
	 * UID is the unique in time and space value for this object.
	 * It is typically generated by the server on successful creation of a resource
	 * and is not allowed to change on PUT operations.
	 *
	 * Populated by the system. Read-only.
	 * @see http://kubernetes.io/docs/user-guide/identifiers#uids
	 */
	uid?: string;
}

/**
 * OwnerReference contains enough information to let you identify an owning object.
 * An owning object must be in the same namespace as the dependent,
 * or be cluster-scoped, so there is no namespace field.
 */
interface OwnerReference {

	/**
	 * API version of the referent
	 */
	apiVersion: string;

	/**
	 * If true, AND if the owner has the "foregroundDeletion" finalizer,
	 * then the owner cannot be deleted from the key-value store until this reference is removed.
	 * Defaults to false. To set this field, a user needs "delete" permission of the owner,
	 * otherwise 422 (Unprocessable Entity) will be returned.
	 */
	blockOwnerDeletion?: boolean;

	/**
	 * If true, this reference points to the managing controller
	 */
	controller?: boolean;

	/**
	 * Kind of the referent.
	 * @see https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
	 */
	kind: string;

	/**
	 * Name of the referent.
	 * @see http://kubernetes.io/docs/user-guide/identifiers#names
	 */
	name: string;

	/**
	 * UID of the referent.
	 * @see http://kubernetes.io/docs/user-guide/identifiers#uids
	 */
	uid: string;
}

/**
 * ManagedFieldsEntry is a workflow-id, a FieldSet and the group version
 * of the resource that the fieldset applies to.
 */
interface ManagedFieldsEntry {

	/**
	 * APIVersion defines the version of this resource that this field set applies to.
	 * The format is "group/version" just like the top-level APIVersion field.
	 * It is necessary to track the version of a field set because it cannot be automatically converted.
	 */
	apiVersion?: string;

	/**
	 * FieldsType is the discriminator for the different fields format and version.
	 * There is currently only one possible value: "FieldsV1".
	 */
	fieldsType?: string;

	/**
	 * FieldsV1 holds the first JSON version format as described in the "FieldsV1" type
	 */
	fieldsV1?: FieldsV1;

	/**
	 * Manager is an identifier of the workflow managing these fields
	 */
	manager?: string;

	/**
	 * Operation is the type of operation which lead to this ManagedFieldsEntry being created.
	 * The only valid values for this field are 'Apply' and 'Update'.
	 */
	operation?: string;

	/**
	 * Subresource is the name of the subresource used to update that object,
	 * or empty string if the object was updated through the main resource.
	 * The value of this field is used to distinguish between managers,
	 * even if they share the same name.
	 * For example, a status update will be distinct from a regular update
	 * using the same manager name.
	 * Note that the APIVersion field is not related to the Subresource field
	 * and it always corresponds to the version of the main resource.
	 */
	subresource?: string;

	/**
	 * Time is timestamp of when these fields were set.
	 * It should always be empty if Operation is 'Apply'.
	 */
	time?: string;
}

/**
 * FieldsV1 stores a set of fields in a data structure like a Trie, in JSON format.
 *
 * Each key is either a '.' representing the field itself,
 * and will always map to an empty set, or a string representing a sub-field or item.
 * The string will follow one of these four formats:
 * 'f:<name>', where <name> is the name of a field in a struct,
 * or key in a map 'v:<value>', where <value> is the exact json formatted value of a list item 'i:<index>',
 * where <index> is position of a item in a list 'k:<keys>',
 * where <keys> is a map of  a list item's key fields to their unique values
 * If a key maps to an empty Fields value, the field that key represents is part of the set.
 *
 * The exact format is defined in:
 * @see https://sigs.k8s.io/structured-merge-diff
 */
interface FieldsV1 {
	[key: string]: unknown;
}

/**
 * Cluster providers will have some differences.
 * For example, AKS cluster has special handling
 * for enabling GitOps.
 */
export const enum ClusterProvider {
	/**
	 * Azure Kubernetes Service.
	 */
	AKS = 'AKS',
	/**
	 * Cluster managed by Azure Arc.
	 */
	AzureARC = 'Azure Arc',
	/**
	 * Any cluster that is not AKS and not Azure Arc is
	 * considered generic at this point.
	 */
	Generic = 'Generic',
	/**
	 * Error occurred when trying to determine the cluster provider or it's just not loaded yet.
	 */
	Unknown = 'Unknown',
}

export type KnownClusterProviders = Exclude<ClusterProvider, ClusterProvider.Unknown>;
export const knownClusterProviders: KnownClusterProviders[] = [
	ClusterProvider.AKS,
	ClusterProvider.AzureARC,
	ClusterProvider.Generic,
];
