<?php
namespace RKGeronimo;

use RKGeronimo\Interfaces\InitInterface;
use RKGeronimo\Helpers\Definitions;
use RKGeronimo\Tables\Reservations;
use Timber;

/**
 * Class: Inventory
 *
 * @author Adrijan Adanić <adanic.ado@gmail.com>
 *
 * @see InitInterface
 *
 * @SuppressWarnings(PHPMD.StaticAccess)
 */
class Inventory implements InitInterface
{
    /**
     * init
     *
     * @return void
     */
    public function init()
    {
        add_action('admin_menu', array($this, 'addInventoryPage'));
        add_action('admin_menu', array($this, 'addInventoryNew'));
        add_action('admin_menu', array($this, 'addReservations'));
        //add_action('admin_menu', array($this, 'addNewReservations'));

        add_action('wp_ajax_check_inventory', array($this, 'checkInventory'));
    }

    /**
     * addInventoryPage
     *
     * @return void
     */
    public function addInventoryPage()
    {
        add_menu_page(
            'Upravljanje opremom',
            'Upravljanje opremom',
            'manage_equipment',
            'inventory_managment',
            array($this, 'showInventoryPage'),
            'dashicons-sos',
            6
        );
    }

    /**
     * showInventoryPage
     *
     * @return void
     */
    public function showInventoryPage()
    {
        $context = Timber::get_context();
        if (array_key_exists("edit", $context['request']->get)) {
            $this->showInventoryEdit();

            return;
        };

        $this->showInventoryList();
    }

    /**
     * addInventoryNew
     *
     * @return void
     */
    public function addInventoryNew()
    {
        add_submenu_page(
            'inventory_managment',
            'Dodavanje opreme',
            'Dodaj novi',
            'manage_equipment',
            'inventory_new',
            array($this, 'showInventoryNew')
        );
    }

    /**
     * showInventoryNew
     *
     * @return void
     */
    public function showInventoryNew()
    {
        $context                    = Timber::get_context();
        $context['typeTranslation'] = $this->translateTypes();

        $post = $context['request']->post;
        if (!empty($post)) {
            global $wpdb;
            $tableName = $wpdb->prefix."rkg_inventory";
            $wpdb->insert(
                $tableName,
                array(
                    'id' => $post['id'],
                    'type' => $post['type'],
                    'size' => $post['size'],
                )
            );
        }

        $templates = array( 'inventoryNew.twig' );
        Timber::render($templates, $context);
    }

    /**
     * addReservation
     *
     * @return void
     */
    public function addReservations()
    {
        add_submenu_page(
            'inventory_managment',
            'Izdavanje opreme',
            'Izdavanje opreme',
            'manage_equipment',
            'reservations',
            array($this, 'showReservations')
        );
    }

    /**
     * addNewReservation
     *
     * @return void
     */
    public function addNewReservations()
    {
        add_submenu_page(
            'inventory_managment',
            'Izdavanje bez rezervacije',
            'Izdavanje bez rezervacije',
            'manage_equipment',
            'reservations_new',
            array($this, 'showNewReservations')
        );
    }

    /**
     * showReservations
     *
     * @return void
     */
    public function showReservations()
    {
        global $wpdb;
        $definitions                 = new Definitions();
        $context                     = Timber::get_context();
        $tableName                   = $wpdb->prefix."rkg_excursion_gear";
        $tableName2                  = $wpdb->prefix."rkg_inventory";
        $context['equipment']        = $definitions->defineEquipment();
        $context['typeTranslation']  = $this->translateTypes();
        $context['stateTranslation'] = $this->translateState();

        // var_dump($context['request']->post);

        if (!empty($context['request']->post)) {
            $result = $wpdb->get_row(
                "
            SELECT *
            FROM $tableName
            WHERE id = '{$context['request']->post['reservation']}'
            "
            );
            // var_dump($result);
            $state = 0;
            foreach ($context['typeTranslation'] as $key => $value) {
                // var_dump($key);
                if (!empty($context['request']->post[$key])) {
                    // var_dump($key);
                    $wpdb->update(
                        $tableName,
                        array(
                            $key => $context['request']->post[$key],
                        ),
                        array(
                            'id' => $context['request']->post['reservation'],
                        )
                    );
                    $wpdb->update(
                        $tableName2,
                        array(
                            'state' => 1,
                            'issue_date' => date("Y-m-d H:i:s"),
                            'user_id' => $result->user_id,
                        ),
                        array(
                            'id' => $context['request']->post[$key],
                        )
                    );
                    $state = 1;
                }
            }
            $wpdb->update(
                $tableName,
                array(
                    'state' => $state,
                ),
                array(
                    'id' => $context['request']->post['reservation'],
                )
            );
        }

        $where = "";
        if (isset($context['request']->get['type'])) {
            $where = "WHERE type = '".$context['request']->get['type']."'";
        }
        $context['reservations'] = $wpdb->get_results(
            "
            SELECT *
            FROM $tableName
            $where
            ORDER BY state,id desc
            "
        );

        foreach ($context['typeTranslation'] as $key => $value) {
            $context[$key.'s'] = $this->getAvailableInventory($key);
        }

        $context['masks']['items'] = $this->getAvailableInventory('mask');
        foreach ($context['reservations'] as $key => $value) {
            $context['reservations'][$key]->user =
                new Timber\User($context['reservations'][$key]->user_id);
            $context['reservations'][$key]->post =
                new Timber\Post($context['reservations'][$key]->post_id);
        }

        $exampleListTable = new Reservations();
        $exampleListTable->prepare_items();
        $context['table'] = $exampleListTable;

        $templates = array( 'inventoryReservations.twig' );
        Timber::render($templates, $context);
    }


    public function showNewReservations()
    {
        global $wpdb;
        $definitions                 = new Definitions();
        $context                     = Timber::get_context();
        $context['equipment']        = $definitions->defineEquipment();
        $context['typeTranslation']  = $this->translateTypes();
        $context['stateTranslation'] = $this->translateState();

        foreach ($context['typeTranslation'] as $key => $value) {
            $context[$key.'s'] = $this->getAvailableInventory($key);
        }

        $context['masks']['items'] = $this->getAvailableInventory('mask');

        $context['userList'] = get_users();

        $templates = array( 'inventoryReservationsNew.twig' );
        Timber::render($templates, $context);
    }

    public function checkInventory()
    {
        $id        = $_POST['id'];
        global $wpdb;
        $tableName                   = $wpdb->prefix."rkg_inventory";

        $result = $wpdb->get_row(
            "
            SELECT *
            FROM $tableName
            WHERE id = '$id' AND state = 0
            "
        );

        $json = "no";
        if ($result) {
            $json = "ok";
        }
        echo  json_encode($json);
        wp_die();
    }

    /**
     * translateTypes
     *
     * @return array
     */
    private function translateTypes()
    {
        $types = array(
            "mask"      => 'Maska i disalica',
            "regulator" => 'Regulator',
            "suit"      => 'Odijelo',
            "boots"     => 'Čižmice',
            "gloves"    => 'Rukavice',
            "fins"      => 'Peraje',
            "bcd"       => 'KPL',
            "lead_belt" => 'Pojas za olovo',
        );

        return $types;
    }


    /**
     * translateState
     *
     * @return array
     */
    private function translateState()
    {
        $types = array('Na stanju', 'Izdano', 'Neispravno', 'Izgubljeno', 'Otpisano');

        return $types;
    }

    /**
     * showInventoryEdit
     *
     * @return void
     */
    private function showInventoryEdit()
    {
        global $wpdb;
        $context                     = Timber::get_context();
        $tableName                   = $wpdb->prefix."rkg_inventory";
        $context['typeTranslation']  = $this->translateTypes();
        $context['stateTranslation'] = $this->translateState();


        $post = $context['request']->post;
        if (!empty($post)) {
            $wpdb->update(
                $tableName,
                array(
                    'type' => $post['type'],
                    'size' => $post['size'],
                    'note' => $post['note'],
                ),
                array(
                    'id' => $post['id'],
                )
            );
        }

        $context['itemEdit']         = $wpdb->get_row(
            "SELECT * FROM "
            .$tableName
            ." WHERE id = '".$context['request']->get['edit']."'"
        );

        $tableName                   = $wpdb->prefix."rkg_excursion_gear";
        $users         = $wpdb->get_col(
            "SELECT id FROM "
            .$tableName
            ." WHERE "
            .$context['itemEdit']->type.
            " = '".$context['request']->get['edit']."'"
            ." LIMIT 10"
        );

        foreach ($users as $value) {
            $context['lenters'][] = new Timber\User($value);
        }

        $templates = array('inventoryEdit.twig');
        Timber::render($templates, $context);
    }

    /**
     * showInventoryList
     *
     * @return void
     */
    private function showInventoryList()
    {
        global $wpdb;
        $context                     = Timber::get_context();
        $tableName                   = $wpdb->prefix."rkg_inventory";
        $context['typeTranslation']  = $this->translateTypes();
        $context['stateTranslation'] = $this->translateState();
        $context['inventoryCount']   = $wpdb->get_results(
            "SELECT COUNT(*) as num
            FROM $tableName"
        );
        $context['typeCount']        = $wpdb->get_results(
            "SELECT type, COUNT(*) as num
            FROM $tableName
            GROUP BY type"
        );

        if (isset($context['request']->get['action'])
            && !empty($context['request']->get['ids'])
            && $context['request']->get['action'] >= 0) {
            $ids = implode("', '", $context['request']->get['ids']);
            $query = "UPDATE $tableName
                SET state = {$context['request']->get['action']}
                WHERE id IN ('$ids')
                ";
            $wpdb->query($query);
        }

        $where = "";
        if (isset($context['request']->get['type'])) {
            $where = "WHERE type = '".$context['request']->get['type']."'";
        }
        $context['stateCount'] = $wpdb->get_results(
            "SELECT state, COUNT(*) as num
            FROM $tableName
            $where
            GROUP BY state"
        );

        $where     = "";
        $wherePart = array();
        if (isset($context['request']->get['type'])) {
            $wherePart[] = "type = '".$context['request']->get['type']."'";
        }
        if (isset($context['request']->get['state'])) {
            $wherePart[] = "state = '".$context['request']->get['state']."'";
        }
        if (isset($context['request']->get['id'])) {
            $wherePart[] = "id = '".$context['request']->get['id']."'";
        }
        if (!empty($wherePart)) {
            $where = "WHERE ".implode(" AND ", $wherePart);
        }

        $context['orderby'] = empty($context['request']->get['orderby'])
            ? 'id' : $context['request']->get['orderby'];
        $context['order']   = empty($context['request']->get['order'])
            ? 'asc' : $context['request']->get['order'];

        $context['inventoryItems'] = $wpdb->get_results(
            "
            SELECT *
            FROM $tableName
            $where
            ORDER BY {$context['orderby']} {$context['order']}
            "
        );


        foreach ($context['inventoryItems'] as $key => $value) {
            $context['inventoryItems'][$key]->user =
                new Timber\User($value->user_id);
        }

        $templates = array('inventory.twig');
        Timber::render($templates, $context);
    }

    /**
     * getAvailableInventory
     *
     * @param mixed $type
     *
     * @return array
     */
    private function getAvailableInventory($type)
    {
        global $wpdb;

        $definitions = new Definitions();
        $equipment   = $definitions->defineEquipment();
        $tableName   = $wpdb->prefix."rkg_inventory";

        if (!$equipment[$type]['size']) {
            return $wpdb->get_results(
                "
            SELECT *
            FROM $tableName
            WHERE type = '$type' AND STATE = 0
            ORDER BY id
            "
            );
        }

        $result = null;
        foreach ($equipment[$type]['size'] as $value) {
            $result[$value] = $wpdb->get_results(
                "
            SELECT *
            FROM $tableName
            WHERE type = '$type' AND STATE = 0 and size = '$value'
            ORDER BY id
            "
            );
        }

        return $result;
    }
}
